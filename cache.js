const fs = require('fs');
const path = require('path');

// 获取调用文件的文件名
function getCallerFileName() {
    const originalFunc = Error.prepareStackTrace;

    let callerfile;
    try {
        const err = new Error();
        let currentfile;

        Error.prepareStackTrace = (err, stack) => stack;

        currentfile = err.stack.shift().getFileName();

        while (err.stack.length) {
            callerfile = err.stack.shift().getFileName();

            if (currentfile !== callerfile) break;
        }
    } catch (e) {}

    Error.prepareStackTrace = originalFunc;

    return path.basename(callerfile, '.js');
}

// 获取缓存文件路径
function getCacheFilePath() {
    const callerFileName = getCallerFileName();
    return path.join(__dirname, `${callerFileName}_cache.json`);
}

// 初始化缓存文件
function initializeCache() {
    const cacheFilePath = getCacheFilePath();
    if (!fs.existsSync(cacheFilePath)) {
        fs.writeFileSync(cacheFilePath, JSON.stringify({}));
    }
}

// 读取缓存文件
function readCache(key) {
    const cacheFilePath = getCacheFilePath();
    const data = fs.readFileSync(cacheFilePath, 'utf-8');
    return JSON.parse(data)[key];
}

// 写入缓存文件
function writeCache(data) {
    const cacheFilePath = getCacheFilePath();
    fs.writeFileSync(cacheFilePath, JSON.stringify(data, null, 2));
}

// 新增缓存
function addCache(key, value) {
    const cacheFilePath = getCacheFilePath();
    let cache = {};

    if (fs.existsSync(cacheFilePath)) {
        const data = fs.readFileSync(cacheFilePath, 'utf-8');
        cache = JSON.parse(data);
    }

    cache[key] = value;
    writeCache(cache);
}


// 修改缓存
function updateCache(key, value) {
    const cache = readCache();
    if (cache.hasOwnProperty(key)) {
        cache[key] = value;
        writeCache(cache);
    } else {
        console.log(`Key "${key}" does not exist.`);
    }
}

// 删除缓存
function deleteCache(key) {
    const cache = readCache();
    if (cache.hasOwnProperty(key)) {
        delete cache[key];
        writeCache(cache);
    } else {
        console.log(`Key "${key}" does not exist.`);
    }
}

// 导出模块
module.exports = {
    initializeCache,
    addCache,
    updateCache,
    deleteCache,
    readCache
};
