const fs = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');
const { readdir, stat } = require('fs/promises');

const cache = new Map();
const installedPackages = new Set();
const categories = {};

const pythoncmd = () => {
  const venvPath = path.join(__dirname, "venv");
  const venvPythonPath = process.platform === "win32"
    ? path.join(venvPath, "Scripts", "python")
    : path.join(venvPath, "bin", "python");

  try {
    execSync(`${venvPythonPath} -V`, { stdio: 'ignore' });
    return venvPythonPath;
  } catch {

    return (() => {
      const commands = ["python3", "python", "py"]; // add more if needed, can include python2
      for (const cmd of commands) {
        try {
          execSync(`${cmd} -V`, { stdio: 'ignore' });
          return cmd;
        } catch {}
      }
      return "python3";
    })();

  }
};

setInterval(() => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.time > 10000) cache.delete(key);
  }
}, 10000);

async function ensurePackages(filePath) {
  try {
    const content = await fs.promises.readFile(filePath, 'utf-8');
    const imports = content.match(/import.*|from.*import.*/g) || [];
    const packages = imports
      .map(line => line.trim()
        .replace(/^import\s+/, '')
        .replace(/^from\s+/, '')
        .split(/\s+/)
        .filter(part => !part.includes('.') && part !== 'as' && part)
        .map(part => part.split(',')[0].trim())[0]
      )
      .filter(Boolean);

    for (const pkg of packages) {
      if (installedPackages.has(pkg)) continue;

      try {
        execSync(`${await pythoncmd()} -c "import ${pkg}"`, { stdio: 'ignore' });
      } catch {
        execSync(`pip install --no-cache-dir --disable-pip-version-check ${pkg}`, { stdio: 'ignore' });
      }
      installedPackages.add(pkg);
    }
  } catch (error) {
    console.error(`package error: ${error.message}`);
    throw error;
  }
}

const create = (filePath) => {
  return async (token, params) => {
    const paramsArray = Array.isArray(params) ? params
      : typeof params === 'object' && params !== null ? Object.values(params)
      : params != null ? [params]
      : [];

    const key = `${filePath}_${token?.slice(-15)}_${paramsArray.map(p => String(p)).join(' ')}`;
    const cached = cache.get(key);
    if (cached && Date.now() - cached.time < 10000) {
      return cached.data;
    }

    try {
      await ensurePackages(filePath);

      const pythonPath = await pythoncmd();
      const args = [filePath, ...(token ? [token] : []), ...paramsArray.map(String)];
      const result = spawnSync(pythonPath, args, {
        env: {
          PYTHONPATH: __dirname,
          PYTHONIOENCODING: 'utf-8',
        },
        encoding: 'utf-8',
      });

      if (result.stderr) {
        return { success: false, error: result.stderr };
      }

      try {
        const output = JSON.parse(result.stdout);
        cache.set(key, { data: output, time: Date.now() });
        return output;
      } catch {
        return { success: false, error: "invalid output format" };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
};

(async () => {
  const algosPath = path.join(__dirname, "algos");
  async function* walk(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const res = path.resolve(dir, entry.name);
      if (entry.isDirectory()) yield* walk(res);
      else yield res;
    }
  }

  for await (const filePath of walk(algosPath)) {
    if (!filePath.endsWith(".py")) continue;

    const parts = filePath.split(path.sep);
    const category = parts[parts.length - 2];
    const methodName = path.basename(filePath, '.py');

    categories[category] ??= {};
    categories[category][methodName] = create(filePath);
  }
})();

module.exports = categories;
