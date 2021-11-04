class LS {
  inspect () {
    return ["file1", "file2"]
  }

  apply(args) {
    return {
      inspect() {
        return [
          { "name": "file1", "size": 243 }
          { "name": "file2", "size": 342 }
        ]
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
