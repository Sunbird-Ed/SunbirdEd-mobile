export interface hierarchyInfo {
    contentType: string;
    identifier: string
}
export interface playerActionHandlerDelegate {
    onContentNotFound(identifier: string, hierarchyInfo: Array<hierarchyInfo>);
    onUserSwitch();
}