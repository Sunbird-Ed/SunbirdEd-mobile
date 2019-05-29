export interface hierarchyInfo {
    contentType: string;
    identifier: string
}
export interface user {
    uid: string
}
export interface playerActionHandlerDelegate {
    onContentNotFound(identifier: string, hierarchyInfo: Array<hierarchyInfo>);
    onUserSwitch(user: user);
}