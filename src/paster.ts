import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as fse from 'fs-extra';
import { spawn, exec } from 'child_process';
import { platform } from 'process';
import { resolve } from 'path';
import { rejects } from 'assert';
import { Config } from './config';

interface Paster {
    readonly fileSep: string;
    readonly config: Config;
    paste(): void;
}


class WindowsPaster implements Paster {
    readonly fileSep: string;
    readonly config: Config;
    constructor() {
        this.fileSep = "\\";
        this.config = new Config;
    }

    paste(): void {

    }
}