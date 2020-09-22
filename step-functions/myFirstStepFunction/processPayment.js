exports.handler = async (event) => {
  const paymentSuccessful = Math.random() > 0.2

  return {
    result: paymentSuccessful,
  }
}