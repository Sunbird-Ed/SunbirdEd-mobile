import { MimeType } from '@app/app';
import { Content, ContentData } from 'sunbird-sdk';
import { Pipe, PipeTransform } from '@angular/core';
​
/**
 Contents are filtered based on given mimetype
 */
​
@Pipe({
  name: 'hasMimeType',
})
export class MimeTypePipe implements PipeTransform {
  transform(item: Content, mimeTypes: string[] = ['all']): boolean {
    if (!mimeTypes) {
      return true;
    } else {
      if (mimeTypes.indexOf('all') > -1) {
        if (item.contentData.mimeType === MimeType.COLLECTION && !item.children) {
            return false;
        }
        return true;
      }
      return this.getFilteredItems(item.children, mimeTypes);
    }
  }
​
​
  getFilteredItems(contents: Content[] = [], mimeTypes: string[]): boolean {
    const t = this.flattenDeep(contents)
      .some((c) => !!mimeTypes.find(m => m === c.contentData.mimeType));
    return t;
  }
​
  private flattenDeep(contents: Content[]): Content[] {
    return contents.reduce((acc, val) => {
      if (val.children) {
        // const newVal = { ...val };
        // delete newVal['children'];
        acc.push(val);
        return acc.concat(this.flattenDeep(val.children));
      } else {
        return acc.concat(val);
      }
    }, []);
  }
}
