export const migrations = {
  2: data => {
    const transaction = data.transaction
    if (transaction && transaction.data) {
      transaction.data = transaction.data.map(tx => {
        return {
          ...tx,
          receipt: null // Remove previous receipt. Will save receipt on demand
        }
      })
    }
    return { ...data, transaction }
  }
}
