import { NgModule } from '@angular/core';
import { FileSizePipe } from './file-size/file-size';
import { CSAPipe } from './csa/csa';
import { MimeTypePipe } from './mime-type/mime-type'
@NgModule({
  declarations: [FileSizePipe, CSAPipe, MimeTypePipe],
  imports: [],
  exports: [FileSizePipe, CSAPipe, MimeTypePipe]
})
export class PipesModule {}
