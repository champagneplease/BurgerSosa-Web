export const formatOrderForWhatsApp = (order: any, phoneNumber: string) => {
  let message = `*NUEVO PEDIDO - BURGER SOSA*\n\n`;
  message += `*Cliente:* ${order.customerName}\n`;
  message += `*Teléfono:* ${order.customerPhone}\n`;
  message += `*Tipo:* ${order.type === 'DELIVERY' ? 'Envío a domicilio' : 'Retiro en local'}\n`;
  
  if (order.type === 'DELIVERY' && order.customerAddress) {
    message += `*Dirección:* ${order.customerAddress}\n`;
  }

  message += `\n*DETALLE DEL PEDIDO:*\n`;
  
  order.items.forEach((item: any) => {
    message += `\n- *${item.quantity}x ${item.product.name}* ($${(Number(item.unitPriceCaptured) * item.quantity).toLocaleString('es-AR')})\n`;
    if (item.modifiers && item.modifiers.length > 0) {
      const modifierCounts = item.modifiers.reduce((acc: any, curr: any) => {
        const name = curr.modifier.name;
        acc[name] = (acc[name] || 0) + 1;
        return acc;
      }, {});
      const modifiersText = Object.entries(modifierCounts).map(([name, count]) => {
        if (count === 1 && (name.toLowerCase().includes('sin ') || name.toLowerCase().includes('con '))) {
           return name; // Don't show "1x Sin cebolla", just "Sin cebolla"
        }
        return `${count}x ${name}`;
      }).join(', ');
      message += `   > Agregados: ${modifiersText}\n`;
    }
    if (item.notes) {
      message += `   > Notas: ${item.notes}\n`;
    }
  });

  message += `\n------------------------\n`;
  message += `*TOTAL A PAGAR:* $${Number(order.total).toLocaleString('es-AR')}\n`;
  message += `------------------------\n\n`;
  message += `Este pedido fue generado desde la web.`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
};
