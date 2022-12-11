// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as fse from 'fs-extra';
import { spawn, exec } from 'child_process';
import { platform } from 'process';
import { resolve } from 'path';
import { rejects } from 'assert';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "helloworld" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('helloworld.helloWorld', () => {
		// vscode.window.showSaveDialog();
		let c = vscode.workspace.getConfiguration().get("some.config");
		vscode.window.showInformationMessage("config:" + c);
		vscode.workspace.getConfiguration().update("some.config", "lalalal", false)
			.then(() => {
				Promise.resolve(true);
			}).then(undefined, err => Promise.reject(err));
		vscode.window.showInformationMessage("config change:" + vscode.workspace.getConfiguration().get("some.config"));

		Util.paste();
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }

class Util {
	static fileSeparator: string = Util.getFileSeparator();

	private static getFileSeparator(): string {
		let fs = "/";
		switch (platform) {
			case "win32":
				fs = "\\";
				break;
			case "linux":
			case "darwin":
				fs = "/";
				break;
		}
		return fs;
	}

	public static paste() {
		let editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage("No active editor");
			return;
		}

		let document = editor.document;
		if (document.isUntitled) {
			vscode.window.showErrorMessage("Document untitled.You need to save it first.");
			return;
		}

		// if (document.languageId !== "markdown") {
		// 	vscode.window.showErrorMessage("It only works in markdown file.");
		// 	return;
		// }

		let documentUri = document.uri.fsPath;
		let imageDir = documentUri.substring(0, documentUri.lastIndexOf(Util.fileSeparator)) + "\\images";
		if (!fs.existsSync(imageDir)) {
			// 不存在直接创建
			fs.mkdirSync(imageDir);
		} else if (!fs.statSync(imageDir).isDirectory()) {
			// 存在同名文件，询问是否删除
			vscode.window.showInformationMessage(`There is a file which has the same path with ${imageDir}. Do you want to remove it?`, "Yes", "No").then(choose => {
				if (choose === "Yes") {
					fs.rmSync(imageDir);
					fs.mkdirSync(imageDir);
				} else {
					vscode.window.showErrorMessage("You should set image.save.enable off or change image.storage.path.");
					return;
				}
			});
		}

		// 不同平台执行不同脚本复制图片
		// let platform = process.platform;
		const imagePath = "C:\\temp\\temp1.png";
		let command = this.getCommand(imagePath);
		if (command === "") {
			vscode.window.showErrorMessage(`${platform} is not supported.`);
		}

		exec(command, (error, stdout, _) => {
			if (error) {
				vscode.window.showInformationMessage(stdout);
			}
		});

		this.convertImage2Base64(editor, imageDir, "temp.jpg");

	}


	private static getCommand(imagePath: string): string {
		let command = "";
		if (platform === 'win32') {
			command = "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe";
			let powershellExisted = fs.existsSync(command);
			if (!powershellExisted) {
				command = "powershell";
			}
			const scriptPath = path.join(__dirname, "../src/lib/windows.ps1");
			command += ` ${scriptPath} ${imagePath}`;
		} else if (platform === 'darwin') {
			// not support Mac currently
		} else if (platform === 'linux') {
			// not support Linux currently
		}
		return command;
	}

	// 获取本地图片，在当前位置和文件末尾分别插入base64图片引用和base64图片
	public static convertImage2Base64(editor: vscode.TextEditor, imageDir: string, imageName: string) {
		let imagePath = `${imageDir}${Util.fileSeparator}${imageName}`;
		fs.readFile(imagePath, 'binary', function (err, data) {
			if (err) {
				vscode.window.showErrorMessage(err.message);
			}

			editor.edit((edit) => {
				let reg = /\.(png|jpg|gif|jpeg|webp)$/;
				let type = imageName.match(reg);
				if (!type) {
					vscode.window.showErrorMessage("Image format not in png|jpg|gif|jpeg|webp.");
					return;
				}
				let lineCnt = editor.document.lineCount;
				let lastPosition = editor.document.lineAt(lineCnt - 1).range.end;
				edit.insert(editor.selection.active, `![image][${imageName}]`);
				const buf = Buffer.from(data, 'binary');
				edit.insert(lastPosition, "\n\n" + `[${imageName}]:data:image/` + <string>type.at(1) + ";base64," + buf.toString('base64'));
			});
		});
	}
}