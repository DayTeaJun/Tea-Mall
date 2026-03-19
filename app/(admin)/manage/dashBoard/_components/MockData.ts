export const getMockSalesData = () => {
  const today = new Date();
  const salesData = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateString = date.toLocaleDateString("ko-KR", {
      month: "short",
      day: "numeric",
    });

    const randomAmount = Math.floor(Math.random() * 500000) + 100000;

    salesData.push({
      date: dateString,
      amount: randomAmount,
    });
  }

  return salesData;
};
