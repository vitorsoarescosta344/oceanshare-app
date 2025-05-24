export default (value: number) => {
  const formCurrency = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  });

  const formated = formCurrency.format(value);

  return formated;
};
