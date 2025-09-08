// hero-effect.js
// 初期ゆらぎ＋マウス強調の粒子トレイル

// --- 設定値（必要ならここを調整） ---
const PARTICLE_COLOR = [230, 57, 70]; // 赤系 RGB（例: コーラル寄り）
const INITIAL_PARTICLES = 30;         // 初期に漂わせる粒子数
const MIN_PARTICLES = 20;             // 補充する閾値（これより少なくなったら補充）
const HERO_FALLBACK_HEIGHT = 300;     // hero要素が取れない場合の高さ（px）

// 粒子エフェクトのp5インスタンス生成関数
function createParticleSketch(targetSelector, getWidth, getHeight) {
  return function(p) {
    let particles = [];

    p.setup = function() {
      const w = getWidth();
      const h = getHeight();
      const cnv = p.createCanvas(w, h);
      const target = document.querySelector(targetSelector);
      if (target && cnv) {
        cnv.parent(target);
      } else {
        cnv.parent(document.body);
      }
      p.noStroke();
      for (let i = 0; i < INITIAL_PARTICLES; i++) {
        particles.push({
          x: p.random(p.width),
          y: p.random(p.height),
          alpha: p.random(40, 90),
          radius: p.random(2, 5),
          vx: p.random(-0.5, 0.5),
          vy: p.random(-0.5, 0.5)
        });
      }
      cnv.style('display', 'block');
    };

    p.draw = function() {
      p.clear();
      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.alpha -= 0.3;
        if (particle.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }
        p.fill(PARTICLE_COLOR[0], PARTICLE_COLOR[1], PARTICLE_COLOR[2], particle.alpha);
        p.circle(particle.x, particle.y, particle.radius * 2);
      }
      if (particles.length < MIN_PARTICLES) {
        particles.push({
          x: p.random(p.width),
          y: p.random(p.height),
          alpha: p.random(40, 90),
          radius: p.random(2, 5),
          vx: p.random(-0.5, 0.5),
          vy: p.random(-0.5, 0.5)
        });
      }
    };

    p.mouseMoved = function() {
      // マウス座標がキャンバス内の場合のみ
      if (
        p.mouseX >= 0 && p.mouseX <= p.width &&
        p.mouseY >= 0 && p.mouseY <= p.height
      ) {
        for (let i = 0; i < 4; i++) {
          particles.push({
            x: p.mouseX,
            y: p.mouseY,
            alpha: p.random(160, 220),
            radius: p.random(3, 6),
            vx: p.random(-1.5, 1.5),
            vy: p.random(-1.5, 1.5)
          });
        }
      }
    };

    p.windowResized = function() {
      const w = getWidth();
      const h = getHeight();
      p.resizeCanvas(w, h);
    };
  };
}

// .hero用
new p5(
  createParticleSketch(
    '.hero',
    () => document.querySelector('.hero')?.clientWidth || window.innerWidth,
    () => document.querySelector('.hero')?.clientHeight || HERO_FALLBACK_HEIGHT
  )
);

// body用（body全体を覆うキャンバス）
new p5(
  createParticleSketch(
    'body',
    () => window.innerWidth,
    () => window.innerHeight
  )
);