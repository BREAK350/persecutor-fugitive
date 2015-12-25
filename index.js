'use strict';
const Vector = require('./vector2d');
// Жертва (fugitive) тікає вздовж вісі ox в додатньому напрямку з точки (0, 0).
// Хижак (persecutor) знаходиться вище вісі ox

function solveQuadraticInReal(a, b, c) {
	// a * x ^ 2 + b * x + c = 0
	let x = [];
	if(a != 0 || b != 0) {
		let d = b * b - 4 * a * c;
		if(d >= 0) {
			let sqrtD = Math.sqrt(d);
			x[0] = (-b - sqrtD) / (2 * a);
			x[1] = (-b + sqrtD) / (2 * a);
		}
	}
	return x;
}

function getParalel(persecutorSpeed, persecutorDistance, persecutorStart, fugitiveSpeed) {
	let times = solveQuadraticInReal(persecutorSpeed * persecutorSpeed - fugitiveSpeed * fugitiveSpeed,
		2 * fugitiveSpeed * persecutorStart, -persecutorDistance * persecutorDistance - persecutorStart * persecutorStart);
	let res = {
		persecutor: [],
		fugitive: []
	};
	if(times.length > 0) {
		let t = times[1];
		let end = Vector.getVectorXY(t * fugitiveSpeed, 0);
		for(let x = 0; x < end.x; x += fugitiveSpeed) {
			res.fugitive.push(Vector.getVectorXY(x, 0));
		}
		let begin = Vector.getVectorXY(persecutorStart, persecutorDistance);
		let direction = Vector.getDiff(end, begin);
		let dirLen = Vector.getLength(direction);
		let i = 0;
		while(persecutorSpeed * i < dirLen) {
			let temp = Vector.getXY(direction);
			Vector.setLength(temp, persecutorSpeed * i);
			Vector.addToFirst(temp, begin);
			res.persecutor.push(temp);
			i++;
		}
	}
	return res;
}

function getPogony(persecutorSpeed, persecutorDistance, persecutorStart, fugitiveSpeed) {
	let res = {
		persecutor: [],
		fugitive: []
	};
	let pBegin = Vector.getVectorXY(persecutorStart, persecutorDistance);
	let fBegin = Vector.getVectorXY(0, 0);
	let ps2 = persecutorSpeed * persecutorSpeed;
	let fSpeed = Vector.getVectorXY(fugitiveSpeed, 0);
	res.persecutor.push(pBegin);
	res.fugitive.push(fBegin);
	do {
		fBegin = Vector.getXY(fBegin);
		Vector.addToFirst(fBegin, fSpeed);
		res.fugitive.push(fBegin);

		let dir = Vector.getDiff(fBegin, pBegin);
		Vector.setLength(dir, persecutorSpeed);
		pBegin = Vector.getXY(pBegin);
		Vector.addToFirst(pBegin, dir);
		res.persecutor.push(pBegin);
	} while(Vector.getDistanceSq(pBegin, fBegin) > ps2);
	return res;
}

global.getParalel = getParalel;
global.getPogony = getPogony;