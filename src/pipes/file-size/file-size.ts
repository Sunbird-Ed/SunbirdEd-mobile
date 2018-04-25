import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the FileSizePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'fileSize',
})
export class FileSizePipe implements PipeTransform {

  /**
   * Takes a size and return readable size.
   */
  transform(size: any, ...args) {
    if (size) {
      if (isNaN(size))
        size = 0;

      // if (size < 1024)
      //   return size + ' Bytes';

      size /= 1024;

      if (size < 1024)
        return size.toFixed(2) + ' KB';

      size /= 1024;

      if (size < 1024)
        return size.toFixed(2) + ' MB';

      size /= 1024;

      if (size < 1024)
        return size.toFixed(2) + ' GB';

      size /= 1024;

      return size.toFixed(2) + ' TB';
    };
  }
}
