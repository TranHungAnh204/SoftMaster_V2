const formatPrice = (price = 0) => {
  return price.toLocaleString("it-IT", { style: "currency", currency: "VND" });
};

export default formatPrice;
