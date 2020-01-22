# catzip

Print the content from all the files in a zip archive.

## Usage

```txt
catzip

  Concatenate all the file contents of a zip file. Designed for use with zip    
  archives of simple, project code.                                             

Options

 -h, --help          Display this usage guide.                                  
 --src zip file ...  Zip file(s) to operate on. This is the default argument.   
                     Any extra arguments will be assumed to be zip files. It    
                     works best if these files end with ".zip".                 
 -s, --save          Save output to file. This is especially useful when        
                     specifying multiple zip files. Without this option, all of 
                     the content is printed together. With this option, the     
                     output of each zip file is saved to a different text file. 
                     Each text file is named the same as the input file,        
                     except that ".zip" is replaced with ".txt".                

Examples

  catzip John_Smith.zip # print content to screen 

  catzip --save A.zip B.zip # print A.zip into A.txt, Z.zip -> B.txt 

Quirks

  This utility was written to aid recruiters in printing and sharing code       
  written by candidates. It has some quirks specific to that task.              

  Some files inside the archive will be ignored. For example, it won't print    
  the content of "package.json".                                                

  The files in the archive are expected to be short and contain code. The lines 
  are numbered for each file on the output.                                     

  The name of the archive is printed on the first line, and the name of each    
  file is printed at the beginning and end of its content.                     
```

## Build

To create stand-alone binaries, we use `pkg`. This is useful for any recruiters that don't have `node` installed, and don't want to install it.

```bash
npm install
pkg -t node12-macos,node12-linux,node12-win catzip.js
```

`pkg` makes these stand-alone by building an entire version of node with them. So they are **huge**. Many people will probably prefer run it from source.