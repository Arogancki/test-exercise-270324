import * as fs from 'fs-extra';
import path from 'path'

export default class File {
    async readDir(...pathToFile: string[]) {
        return fs.readdir(path.join(...pathToFile))
    }

    async readJsonFile(...pathToFile: string[]) {
        return fs.readFile(path.join(...pathToFile), 'utf-8');
    }
}
