class LS {
  inspect () {
    console.log("fileList")
  }

  apply(args) {
    return {
      inspect() {
        console.log("longFileList")
      }

      apply(filename) {
        return {
          inspect() {
            console.log("longFileListFilename")
          }
        }
      }
    }
  }
}
