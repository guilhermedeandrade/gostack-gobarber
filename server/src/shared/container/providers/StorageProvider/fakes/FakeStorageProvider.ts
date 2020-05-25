import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider'

class DiskStorageProvider implements IStorageProvider {
  private storage: string[] = []

  public async saveFile(file: string): Promise<string> {
    this.storage.push(file)

    return file
  }

  public async deleteFile(file: string): Promise<void> {
    const findIndex = this.storage.findIndex(item => item === file)

    if (findIndex !== -1) {
      this.storage.splice(findIndex, 1)
    }
  }
}

export default DiskStorageProvider
