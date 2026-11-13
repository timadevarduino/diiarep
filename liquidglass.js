function initLiquidGlass() {
  const target = document.querySelector('.tile:first-child .box');
  if (!target || document.getElementById('liquid-glass-filter')) return;

  const rect = target.getBoundingClientRect();
  const w = Math.round(rect.width) || 68;
  const h = Math.round(rect.height) || 68;
  const scale = -50;
  const chroma = 5;

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  const gradX = ctx.createLinearGradient(0, 0, w, 0);
  gradX.addColorStop(0, 'rgb(255, 128, 128)');
  gradX.addColorStop(0.22, 'rgb(128, 128, 128)');
  gradX.addColorStop(0.78, 'rgb(128, 128, 128)');
  gradX.addColorStop(1, 'rgb(0, 128, 128)');
  ctx.fillStyle = gradX;
  ctx.fillRect(0, 0, w, h);

  const gradY = ctx.createLinearGradient(0, 0, 0, h);
  gradY.addColorStop(0, 'rgb(0, 0, 255)');
  gradY.addColorStop(0.22, 'rgb(0, 0, 128)');
  gradY.addColorStop(0.78, 'rgb(0, 0, 128)');
  gradY.addColorStop(1, 'rgb(0, 0, 0)');
  ctx.globalCompositeOperation = 'difference';
  ctx.fillStyle = gradY;
  ctx.fillRect(0, 0, w, h);

  ctx.globalCompositeOperation = 'source-over';
  ctx.filter = 'blur(6px)';
  ctx.fillStyle = 'rgb(128, 128, 128)';
  const inset = Math.round(w * 0.16);
  ctx.beginPath();
  ctx.roundRect(inset, inset, w - inset * 2, h - inset * 2, 12);
  ctx.fill();

  const mapDataUrl = canvas.toDataURL();
  const svgNS = 'http://w3.org';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('style', 'position:fixed;width:0;height:0;pointer-events:none;');
  svg.innerHTML = `
    <defs>
      <filter id="liquid-glass-filter" x="0%" y="0%" width="100%" height="100%" color-interpolation-filters="sRGB">
        <feImage href="${mapDataUrl}" x="0" y="0" width="${w}" height="${h}" result="map"/>
        <feDisplacementMap in="SourceGraphic" in2="map" scale="${scale - chroma}" xChannelSelector="R" yChannelSelector="B" result="rDisp"/>
        <feColorMatrix in="rDisp" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="rChan"/>
        <feDisplacementMap in="SourceGraphic" in2="map" scale="${scale}" xChannelSelector="R" yChannelSelector="B" result="gDisp"/>
        <feColorMatrix in="gDisp" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="gChan"/>
        <feDisplacementMap in="SourceGraphic" in2="map" scale="${scale + chroma}" xChannelSelector="R" yChannelSelector="B" result="bDisp"/>
        <feColorMatrix in="bDisp" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="bChan"/>
        <feBlend in="rChan" in2="gChan" mode="screen" result="rg"/>
        <feBlend in="rg" in2="bChan" mode="screen"/>
      </filter>
    </defs>
  `;
  document.body.appendChild(svg);
}

const observer = new MutationObserver(() => initLiquidGlass());
observer.observe(document.documentElement, { childList: true, subtree: true });
window.addEventListener('DOMContentLoaded', initLiquidGlass);
