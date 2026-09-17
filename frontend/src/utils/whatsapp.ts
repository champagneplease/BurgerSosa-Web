export const formatOrderForWhatsApp = (order: any, phoneNumber: string) => {
  let message = `🍔 *NUEVO PEDIDO - BURGER SOSA* 🍔\n\n`;
  message += `👤 *Cliente:* ${order.customerName}\n`;
  message += `📞 *Teléfono:* ${order.customerPhone}\n`;
  message += `🛵 *Tipo:* ${order.type === 'DELIVERY' ? 'Envío a domicilio' : 'Retiro en local'}\n`;
  
  if (order.type === 'DELIVERY' && order.customerAddress) {
    message += `📍 *Dirección:* ${order.customerAddress}\n`;
  }

  message += `\n🛒 *DETALLE DEL PEDIDO:*\n`;
  
  order.items.forEach((item: any) => {
    message += `\n▪️ *${item.quantity}x ${item.product.name}* - $${(Number(item.unitPriceCaptured) * item.quantity).toLocaleString('es-AR')}\n`;
    if (item.modifiers && item.modifiers.length > 0) {
      const modifierCounts = item.modifiers.reduce((acc: any, curr: any) => {
        const name = curr.modifier.name;
        acc[name] = (acc[name] || 0) + 1;
        return acc;
      }, {});
      const modifiersText = Object.entries(modifierCounts).map(([name, count]) => `${count}x ${name}`).join(', ');
      message += `   ↳ _Agregados: ${modifiersText}_\n`;
    }
    if (item.notes) {
      message += `   ↳ _Notas: ${item.notes}_\n`;
    }
  });

  message += `\n========================\n`;
  message += `💰 *TOTAL A PAGAR:* $${Number(order.total).toLocaleString('es-AR')}\n`;
  message += `========================\n\n`;
  message += `_Este pedido fue generado automáticamente desde la web._`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
};
