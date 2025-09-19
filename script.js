(function () {
    const center = { x: 200, y: 200 };
    const r = 180;
    const slicesCount = 8;
    const labels = [
        '500k €',
        '1 Mio €',
        '10 Mio €',
        '100 Mio €',
        '1 Bil. €',
        '10 Bil. €',
        'Death',
        '1 Mio €'
    ];

    const wheelGroup = document.getElementById('wheelGroup');
    const resultEl = document.getElementById('result');
    const spinBtn = document.getElementById('spinBtn');

    const slices = [];
    for (let i = 0; i < slicesCount; i++) {
        const startAngle = -90 + i * (360 / slicesCount);
        const endAngle = startAngle + (360 / slicesCount);
        const midAngle = startAngle + (360 / slicesCount) / 2;

        const sRad = (Math.PI / 180) * startAngle;
        const eRad = (Math.PI / 180) * endAngle;

        const x1 = center.x + r * Math.cos(sRad);
        const y1 = center.y + r * Math.sin(sRad);
        const x2 = center.x + r * Math.cos(eRad);
        const y2 = center.y + r * Math.sin(eRad);

        const pathD = [
            `M ${center.x} ${center.y}`,
            `L ${x1.toFixed(3)} ${y1.toFixed(3)}`,
            `A ${r} ${r} 0 0 1 ${x2.toFixed(3)} ${y2.toFixed(3)}`,
            'Z'
        ].join(' ');

        const ns = 'http://www.w3.org/2000/svg';
        const path = document.createElementNS(ns, 'path');
        path.setAttribute('d', pathD);
        path.setAttribute('class', 'slice');
        path.setAttribute('data-index', i);

        const text = document.createElementNS(ns, 'text');
        const textRadius = r * 0.62;
        const mRad = (Math.PI / 180) * midAngle;
        const tx = center.x + textRadius * Math.cos(mRad);
        const ty = center.y + textRadius * Math.sin(mRad);
        text.setAttribute('x', tx);
        text.setAttribute('y', ty);
        text.setAttribute('class', 'sliceLabel');
        text.textContent = labels[i];

        const rotateDeg = midAngle + 90;
        text.setAttribute('transform', `rotate(${rotateDeg} ${tx} ${ty})`);

        wheelGroup.appendChild(path);
        wheelGroup.appendChild(text);

        slices.push({
            pathEl: path,
            textEl: text,
            midAngle: midAngle
        });
    }

    function angleDiff(a, b) {
        let d = Math.abs(a - b) % 360;
        if (d > 180) d = 360 - d;
        return d;
    }

    let currentRotation = 0;
    let spinning = false;

    function clearHighlights() {
        slices.forEach(s => {
            s.pathEl.classList.remove('highlight');
            s.textEl.classList.remove('highlightText');
        });
    }

    function highlightSlice(index) {
        clearHighlights();
        slices[index].pathEl.classList.add('highlight');
        slices[index].textEl.classList.add('highlightText');
    }

    function determineWinningSlice(finalRotation) {
        let bestIndex = 0;
        let bestDiff = 360;
        for (let i = 0; i < slices.length; i++) {
            const rotatedMid = (slices[i].midAngle + finalRotation) % 360;
            const norm = (rotatedMid + 360) % 360;
            const diff = angleDiff(norm, 270);
            if (diff < bestDiff) {
                bestDiff = diff;
                bestIndex = i;
            }
        }
        return bestIndex;
    }

    spinBtn.addEventListener('click', () => {
        if (spinning) return;
        spinning = true;
        resultEl.textContent = '';

        clearHighlights();

        const extra = Math.floor(Math.random() * 360);
        const turns = 3; // still spins multiple times but faster
        const target = turns * 360 + extra;

        currentRotation = (currentRotation + target) % 360;

        wheelGroup.style.transition = 'transform 1.5s cubic-bezier(0.25, 1, 0.5, 1)';
        wheelGroup.style.transform = `rotate(${currentRotation}deg)`;

        const transitionTimeMs = 1500;
        setTimeout(() => {
            const winnerIndex = determineWinningSlice(currentRotation);
            highlightSlice(winnerIndex);

            const label = labels[winnerIndex];
            resultEl.textContent = label === 'Death' ? 'Result: Death 😱' : `Result: ${label}`;

            spinning = false;
        }, transitionTimeMs);
    });
})();
