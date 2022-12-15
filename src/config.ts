import * as vscode from 'vscode';

export class Config {
    readonly imgSaveEn: boolean;
    readonly imgStorageDir: string;
    readonly imgAutoCompressEn: boolean;
    readonly imgAutoCompressThreshold: number;
    readonly imgName: string;
    readonly imgAutoSortEn: boolean;
    readonly imgManualNameEn: boolean;
    constructor() {
        let configs = vscode.workspace.getConfiguration();
        this.imgSaveEn = configs.get("image.save.enable")!;
        this.imgStorageDir = configs.get("image.storage.dir")!;
        this.imgAutoCompressEn = configs.get("image.auto.compress.enable")!;
        this.imgAutoCompressThreshold = configs.get("image.auto.compress.threshold")!;
        this.imgName = configs.get("image.name")!;
        this.imgAutoSortEn = configs.get("image.auto.sort.enable")!;
        this.imgManualNameEn = configs.get("image.manual.name.enable")!;
    }
}