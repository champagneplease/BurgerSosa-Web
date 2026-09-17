export const getImageUrl = (path: string | null | undefined): string => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  
  // En producción, VITE_API_URL suele apuntar a /api. Las imágenes se sirven directo en el dominio
  // o en /uploads, por lo que quitamos /api para construir la URL base real.
  const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, '');
  
  // Aseguramos que el path empiece con '/'
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${baseUrl}${normalizedPath}`;
};
