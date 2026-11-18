// Gerado pelo build. Separa os idiomas por domínio no Cloudflare Pages.
const ES_HOST = '', BR_HOST = 'pedro2705.github.io';
export async function onRequest(ctx) {
  const url = new URL(ctx.request.url), host = url.hostname.replace(/^www\./, ''), p = url.pathname;
  if (!ES_HOST || host.endsWith('.pages.dev') || host === 'localhost') return ctx.next();
  if (host === ES_HOST) {
    if (p === '/' || p === '/index.html') return ctx.env.ASSETS.fetch(new URL('/es/', url));   // espanhol na raiz
    if (p.startsWith('/es/')) return Response.redirect('https://' + ES_HOST + '/' + url.search, 301);
    return ctx.next();
  }
  if (host === BR_HOST) {
    if (p.startsWith('/es/')) return Response.redirect('https://' + ES_HOST + '/' + url.search, 301);
    if (p.startsWith('/en/')) return Response.redirect('https://' + ES_HOST + p + url.search, 301);
  }
  return ctx.next();
}
