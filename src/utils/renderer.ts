/**
 * Canvas 2D Rendering Engine for VietinBank Flappy Bird
 * Highly polished vector graphics rendered at 60 FPS
 */

import { BirdState, PipeState } from '../types/game';

export interface RenderContext {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  scale: number;
}

// Background clouds
export interface Cloud {
  x: number;
  y: number;
  speed: number;
  radius: number;
}

// Background Hanoi Skyline elements
export function drawSkyline(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  offset: number
) {
  const groundY = height - 90;

  // Sky Gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY);
  skyGrad.addColorStop(0, '#02244C'); // Deep VietinBank Night/Dawn Blue
  skyGrad.addColorStop(0.5, '#0054A6'); // Signature VietinBank Blue
  skyGrad.addColorStop(0.85, '#2588E6'); // Vibrant Light Blue
  skyGrad.addColorStop(1, '#68B4FA'); // Horizon glow
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, groundY);

  // Distant subtle silhouettes (Keangnam / VietinBank Tower / City Skyline)
  ctx.fillStyle = 'rgba(2, 36, 76, 0.35)';
  const farOffset = (offset * 0.15) % 360;
  for (let i = -1; i < width / 90 + 2; i++) {
    const bx = i * 90 - farOffset;
    const bh = 140 + ((i * 47) % 90);
    ctx.fillRect(bx, groundY - bh, 65, bh);

    // Spire for VietinBank-like tower
    if (i % 3 === 0) {
      ctx.beginPath();
      ctx.moveTo(bx + 32, groundY - bh - 35);
      ctx.lineTo(bx + 20, groundY - bh);
      ctx.lineTo(bx + 44, groundY - bh);
      ctx.closePath();
      ctx.fill();
    }
  }

  // Mid-ground modern financial buildings
  ctx.fillStyle = 'rgba(0, 50, 110, 0.55)';
  const midOffset = (offset * 0.35) % 280;
  for (let i = -1; i < width / 70 + 2; i++) {
    const bx = i * 70 - midOffset;
    const bh = 90 + ((i * 31) % 80);
    ctx.fillRect(bx, groundY - bh, 55, bh);

    // Glowing window grids
    ctx.fillStyle = 'rgba(255, 230, 140, 0.3)';
    for (let wy = groundY - bh + 12; wy < groundY - 10; wy += 16) {
      for (let wx = bx + 8; wx < bx + 48; wx += 14) {
        if ((wx + wy) % 5 !== 0) {
          ctx.fillRect(wx, wy, 6, 8);
        }
      }
    }
    ctx.fillStyle = 'rgba(0, 50, 110, 0.55)';
  }
}

// Draw moving clouds
export function drawClouds(
  ctx: CanvasRenderingContext2D,
  clouds: Cloud[],
  width: number
) {
  ctx.save();
  for (const c of clouds) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
    ctx.arc(c.x + c.radius * 0.7, c.y - c.radius * 0.3, c.radius * 0.8, 0, Math.PI * 2);
    ctx.arc(c.x + c.radius * 1.4, c.y, c.radius * 0.65, 0, Math.PI * 2);
    ctx.fill();

    // Subtle cloud highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.beginPath();
    ctx.arc(c.x + c.radius * 0.7, c.y - c.radius * 0.3, c.radius * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

// Draw ground with VietinBank branded curb
export function drawGround(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  offset: number
) {
  const groundY = height - 90;
  const groundHeight = 90;

  // Base ground
  const groundGrad = ctx.createLinearGradient(0, groundY, 0, height);
  groundGrad.addColorStop(0, '#0054A6'); // VietinBank Blue top
  groundGrad.addColorStop(0.15, '#003B75');
  groundGrad.addColorStop(1, '#001E3D');
  ctx.fillStyle = groundGrad;
  ctx.fillRect(0, groundY, width, groundHeight);

  // Top curb highlight
  ctx.fillStyle = '#E31837'; // VietinBank Red line
  ctx.fillRect(0, groundY, width, 4);

  // Golden accent strip
  ctx.fillStyle = '#FFD700';
  ctx.fillRect(0, groundY + 4, width, 2);

  // Moving chevron/stripes on ground
  const stripeWidth = 40;
  const stripeOffset = (offset * 1.5) % (stripeWidth * 2);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  for (let x = -stripeWidth * 2; x < width + stripeWidth * 2; x += stripeWidth * 2) {
    ctx.beginPath();
    ctx.moveTo(x - stripeOffset, groundY + 12);
    ctx.lineTo(x - stripeOffset + stripeWidth, groundY + 12);
    ctx.lineTo(x - stripeOffset + stripeWidth - 25, height);
    ctx.lineTo(x - stripeOffset - 25, height);
    ctx.closePath();
    ctx.fill();
  }

  // VietinBank text emblem embossed on ground
  ctx.save();
  ctx.font = '700 13px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.textAlign = 'center';
  ctx.fillText('NGÂN HÀNG TMCP CÔNG THƯƠNG VIỆT NAM - VIETINBANK', width / 2, height - 32);
  ctx.font = '500 11px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = 'rgba(255, 215, 0, 0.6)';
  ctx.fillText('Nâng giá trị cuộc sống · Bay an toàn - Săn xăng vàng', width / 2, height - 14);
  ctx.restore();
}

// Draw modern architectural VietinBank pillars (pipes)
export function drawPipe(ctx: CanvasRenderingContext2D, pipe: PipeState, height: number) {
  const groundY = height - 90;
  const capHeight = 26;
  const capLip = 6;
  const pipeX = pipe.x;
  const pipeW = pipe.width;

  // Function to draw one pillar (top or bottom)
  const renderPillar = (x: number, y: number, w: number, h: number, isTop: boolean) => {
    if (h <= 0) return;

    ctx.save();

    // Main Column gradient (Metallic High-Tech VietinBank Blue)
    const colGrad = ctx.createLinearGradient(x, 0, x + w, 0);
    colGrad.addColorStop(0, '#003366');
    colGrad.addColorStop(0.25, '#0054A6');
    colGrad.addColorStop(0.65, '#0084EA');
    colGrad.addColorStop(0.9, '#0054A6');
    colGrad.addColorStop(1, '#00254D');

    ctx.fillStyle = colGrad;
    ctx.fillRect(x, y, w, h);

    // Bevel edge highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.fillRect(x + 4, y, 3, h);

    // Inner subtle vertical grooves
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(x + w * 0.45, y, 2, h);
    ctx.fillRect(x + w * 0.75, y, 2, h);

    // Glowing neon indicator strip in column center
    ctx.fillStyle = '#00D2FF';
    ctx.shadowColor = '#00A3FF';
    ctx.shadowBlur = 8;
    ctx.fillRect(x + w / 2 - 1.5, y + (isTop ? 0 : 20), 3, Math.max(0, h - 20));
    ctx.shadowBlur = 0; // reset

    // Cap at the entrance
    const capX = x - capLip;
    const capW = w + capLip * 2;
    const capY = isTop ? y + h - capHeight : y;

    const capGrad = ctx.createLinearGradient(capX, 0, capX + capW, 0);
    capGrad.addColorStop(0, '#002B59');
    capGrad.addColorStop(0.2, '#0054A6');
    capGrad.addColorStop(0.5, '#008BFF');
    capGrad.addColorStop(0.85, '#0054A6');
    capGrad.addColorStop(1, '#001F40');

    ctx.fillStyle = capGrad;
    ctx.beginPath();
    ctx.roundRect(capX, capY, capW, capHeight, [4, 4, 4, 4]);
    ctx.fill();

    // Cap Golden Rim
    const rimY = isTop ? capY + capHeight - 4 : capY;
    ctx.fillStyle = '#FFD700'; // Gold accent
    ctx.fillRect(capX + 2, rimY, capW - 4, 3);

    // VietinBank Red Brand Band
    const redBandY = isTop ? capY + 4 : capY + capHeight - 7;
    ctx.fillStyle = '#E31837';
    ctx.fillRect(capX + 2, redBandY, capW - 4, 3);

    // Center Golden VietinBank Coin Emblem on Cap
    const coinCenterX = capX + capW / 2;
    const coinCenterY = capY + capHeight / 2;
    ctx.beginPath();
    ctx.arc(coinCenterX, coinCenterY, 7.5, 0, Math.PI * 2);
    ctx.fillStyle = '#FFD700';
    ctx.fill();
    ctx.strokeStyle = '#B8860B';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Inner Star / V shape
    ctx.beginPath();
    ctx.arc(coinCenterX, coinCenterY, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#0054A6';
    ctx.fill();

    ctx.restore();
  };

  // Top Pipe
  renderPillar(pipeX, 0, pipeW, pipe.topHeight, true);

  // Bottom Pipe
  const bottomY = pipe.topHeight + pipe.gap;
  const bottomH = groundY - bottomY;
  renderPillar(pipeX, bottomY, pipeW, bottomH, false);
}

// Draw VietinBank Mascot Bird
export function drawBird(ctx: CanvasRenderingContext2D, bird: BirdState) {
  ctx.save();
  ctx.translate(bird.x, bird.y);
  ctx.rotate((bird.rotation * Math.PI) / 180);

  // Wing flap offset
  const wingOffset = Math.sin(bird.wingAngle) * 6;

  // Jet/Energy aura when ascending
  if (bird.vy < -1) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(-18, 2, 10 + Math.abs(bird.vy) * 0.6, 0, Math.PI * 2);
    const boostGrad = ctx.createRadialGradient(-18, 2, 2, -18, 2, 14);
    boostGrad.addColorStop(0, 'rgba(0, 210, 255, 0.7)');
    boostGrad.addColorStop(0.6, 'rgba(0, 114, 206, 0.3)');
    boostGrad.addColorStop(1, 'rgba(0, 84, 166, 0)');
    ctx.fillStyle = boostGrad;
    ctx.fill();
    ctx.restore();
  }

  // Bird Shadow below
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(0, 16, 16, 5, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
  ctx.fill();
  ctx.restore();

  // Tail feathers
  ctx.beginPath();
  ctx.moveTo(-16, 2);
  ctx.lineTo(-26, -5);
  ctx.lineTo(-24, 4);
  ctx.lineTo(-28, 9);
  ctx.lineTo(-14, 8);
  ctx.closePath();
  ctx.fillStyle = '#003E7E';
  ctx.fill();

  // Main Body (Round aerodynamic VietinBank Blue sphere)
  ctx.beginPath();
  ctx.ellipse(0, 0, 19, 16, 0, 0, Math.PI * 2);
  const bodyGrad = ctx.createRadialGradient(-5, -5, 3, 0, 0, 20);
  bodyGrad.addColorStop(0, '#38BDF8'); // Sky Cyan highlight
  bodyGrad.addColorStop(0.35, '#0072CE'); // VietinBank Blue
  bodyGrad.addColorStop(0.85, '#0054A6'); // Navy Blue
  bodyGrad.addColorStop(1, '#003366');
  ctx.fillStyle = bodyGrad;
  ctx.fill();
  ctx.strokeStyle = '#002B59';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Belly / Chest (Crisp bright white / silver)
  ctx.beginPath();
  ctx.ellipse(6, 6, 10, 8, -Math.PI / 8, 0, Math.PI * 2);
  const bellyGrad = ctx.createLinearGradient(0, 0, 12, 12);
  bellyGrad.addColorStop(0, '#FFFFFF');
  bellyGrad.addColorStop(1, '#E2E8F0');
  ctx.fillStyle = bellyGrad;
  ctx.fill();

  // Red Crest / VietinBank Headband
  ctx.beginPath();
  ctx.moveTo(-6, -15);
  ctx.quadraticCurveTo(0, -21, 6, -17);
  ctx.quadraticCurveTo(12, -22, 15, -14);
  ctx.quadraticCurveTo(4, -13, -6, -15);
  ctx.closePath();
  ctx.fillStyle = '#E31837'; // VietinBank Red
  ctx.fill();

  // Little Golden Star on Crest
  ctx.save();
  ctx.translate(6, -17);
  ctx.beginPath();
  ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
  ctx.fillStyle = '#FFD700';
  ctx.fill();
  ctx.restore();

  // Beak (Vibrant Golden-Orange)
  ctx.beginPath();
  ctx.moveTo(14, -2);
  ctx.lineTo(26, 3);
  ctx.lineTo(13, 9);
  ctx.closePath();
  const beakGrad = ctx.createLinearGradient(14, 0, 26, 3);
  beakGrad.addColorStop(0, '#FFA500');
  beakGrad.addColorStop(1, '#FF7A00');
  ctx.fillStyle = beakGrad;
  ctx.fill();
  ctx.strokeStyle = '#D96500';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Big expressive eye
  ctx.beginPath();
  ctx.arc(8, -5, 6.5, 0, Math.PI * 2);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.strokeStyle = '#003366';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Eye Pupil (looking forward & slightly upward)
  const pupilOffset = bird.vy < 0 ? -1 : 0.5;
  ctx.beginPath();
  ctx.arc(10, -5 + pupilOffset, 3.4, 0, Math.PI * 2);
  ctx.fillStyle = '#0F172A';
  ctx.fill();

  // Eye Gleam (Sparkle highlight)
  ctx.beginPath();
  ctx.arc(11, -6 + pupilOffset, 1.2, 0, Math.PI * 2);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();

  // Wing (Animated with wingAngle)
  ctx.save();
  ctx.translate(-3, 1);
  ctx.rotate((wingOffset * Math.PI) / 180);
  ctx.beginPath();
  ctx.ellipse(-3, 0, 11, 7, Math.PI / 12, 0, Math.PI * 2);
  const wingGrad = ctx.createLinearGradient(-14, -7, 8, 7);
  wingGrad.addColorStop(0, '#FFFFFF');
  wingGrad.addColorStop(0.3, '#38BDF8');
  wingGrad.addColorStop(0.8, '#0054A6');
  wingGrad.addColorStop(1, '#003875');
  ctx.fillStyle = wingGrad;
  ctx.fill();
  ctx.strokeStyle = '#002B59';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Red wing tip accent
  ctx.beginPath();
  ctx.moveTo(-13, 1);
  ctx.lineTo(-7, 6);
  ctx.lineTo(-14, 4);
  ctx.closePath();
  ctx.fillStyle = '#E31837';
  ctx.fill();
  ctx.restore();

  ctx.restore();
}
