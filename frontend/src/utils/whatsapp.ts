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
  message += `*TOTAL DEL PEDIDO:* $${Number(order.subtotal).toLocaleString('es-AR')}\n`;
  
  if (order.type === 'DELIVERY') {
    message += `*ENVÍO:* A confirmar según ubicación\n`;
  }
  
  if (order.paymentMethod === 'EFECTIVO') {
    message += `*MÉTODO DE PAGO:* Efectivo\n`;
  } else if (order.paymentMethod === 'TRANSFERENCIA') {
    if (order.type === 'DELIVERY') {
      message += `*MÉTODO DE PAGO:* Transferencia (Esperando total final)\n`;
    } else {
      message += `*MÉTODO DE PAGO:* Transferencia\n`;
      message += `_(Te enviaré el comprobante de pago por aquí)_\n`;
    }
  }

  message += `------------------------\n\n`;
  message += `Este pedido fue generado desde la web.`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
};
