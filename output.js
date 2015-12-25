(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
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
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./vector2d":2}],2:[function(require,module,exports){
'use strict';
const Vector = {
	getVectorXY(x, y) {
		return {
			x: x || 0,
			y: y || 0
		};
	},
	getVectorLengthSinCos(length, sinr, cosr) {
		return Vector.getVectorXY(length * cosr, length * sinr);
	},
	getVectorLengthRadian(length, radian) {
		let sinr = Math.sin(radian);
		let cosr = Math.cos(radian);
		return Vector.getVectorLengthSinCos(length, sinr, cosr);
	},
	setX(vector, x) {
		vector.x = x || 0;
	},
	setY(vector, y) {
		vector.y = y || 0;
	},
	setXY(vector, x, y) {
		Vector.setX(vector, x);
		Vector.setY(vector, y);
	},
	setToZero(vector) {
		Vector.setXY(vector, 0, 0);
	},
	getZero() {
		return Vector.getVectorXY(0, 0);
	},
	getX(vector) {
		return vector.x || 0;
	},
	getY(vector) {
		return vector.y || 0;
	},
	getXY(vector) {
		return Vector.getVectorXY(Vector.getX(vector), Vector.getY(vector));
	},
	getQuarter(vector) {
		let quarter = 0; // first
		let x = Vector.getX(vector);
		let y = Vector.getY(vector);
		if(x >= 0) {
			if(y < 0) {
				quarter = 3; // fourth
			}
		} else {
			if(y >= 0) {
				quarter = 1; // second
			} else {
				quarter = 2; // third
			}
		}
		return quarter;
	},
	getQuarterAccording(vector, center) {
		return Vector.getQuarter(Vector.getDiff(vector, center));
	},
	getMiddleVector(first, second) {
		let summ = Vector.getAdd(first, second);
		Vector.multFirstOnNumber(summ, 0.5);
		return summ;
	},
	getMiddleVectorWithWeight(first, firstWeight, second, secondWeight) {
		if(firstWeight == secondWeight) {
			return Vector.getMiddleVector(first, second);
		}
		if(firstWeight > 0 && secondWeight > 0) {
			let weight = firstWeight + secondWeight;
			let kFirst = firstWeight / weight,
				kSecond = secondWeight / weight;
			let x = Vector.getX(first) * kFirst + Vector.getX(second) * kSecond,
				y = Vector.getY(first) * kFirst + Vector.getY(second) * kSecond;
			return Vector.getVectorXY(x, y);
		}
		return Vector.getZero();
	},
	assignToFirst(first, second) {
		Vector.setXY(first, Vector.getX(second), Vector.getY(second));
	},
	addToFirst(first, second) {
		Vector.setXY(first,
			Vector.getX(first) + Vector.getX(second),
			Vector.getY(first) + Vector.getY(second)
		);
	},
	getAdd(first, second) {
		return Vector.getVectorXY(
			Vector.getX(first) + Vector.getX(second),
			Vector.getY(first) + Vector.getY(second)
		);
	},
	subFromFirst(first, second) {
		Vector.setXY(first,
			Vector.getX(first) - Vector.getX(second),
			Vector.getY(first) - Vector.getY(second)
		);
	},
	getDiff(first, second) {
		return Vector.getVectorXY(
			Vector.getX(first) - Vector.getX(second),
			Vector.getY(first) - Vector.getY(second)
		);
	},
	multFirstOnNumber(vector, num) {
		Vector.setXY(vector,
			Vector.getX(vector) * num,
			Vector.getY(vector) * num
		);
	},
	getMultNum(vector, num) {
		return Vector.getVectorXY(
			Vector.getX(vector) * num,
			Vector.getY(vector) * num
		);
	},
	getLengthSq(vector) {
		let x = Vector.getX(vector),
			y = Vector.getY(vector);
		return x * x + y * y;
	},
	getLength(vector) {
		return Math.sqrt(Vector.getLengthSq(vector));
	},
	getDistanceSq(first, second) {
		return Vector.getLengthSq(Vector.getDiff(first, second));
	},
	getDistance(first, second) {
		return Math.sqrt(Vector.getDistanceSq(first, second));
	},
	reverseX(vector) {
		Vector.setX(vector, -Vector.getX(vector));
	},
	reverseY(vector) {
		Vector.setY(vector, -Vector.getY(vector));
	},
	reverse(vector) {
		Vector.reverseX(vector);
		Vector.reverseY(vector);
	},
	setLength(vector, newLength) {
		newLength = newLength || 0;
		if(newLength < 0) {
			Vector.reverse(vector);
			newLength = -newLength;
		}
		if(newLength == 0) {
			Vector.setToZero(vector);
		} else {
			let oldLength = Vector.getLength(vector);
			if(oldLength > 0) {
				let k = newLength / oldLength;
				Vector.multFirstOnNumber(vector, k);
			}
		}
	},
	getSignedRadian(vector) {
		let radian = 0,
			x = Vector.getX(vector),
			y = Vector.getY(vector);
	    if(x == 0) {
	        if(y >= 0) {
	            radian = Math.PI / 2;
	        } else {
	            radian = -Math.PI / 2;
	        }
	    } else {
	        if(y == 0) {
	            if(x > 0) {
	                radian = 0;
	            } else {
	                radian = Math.PI;
	            }
	        } else {
	            radian = Math.atan(y / x);
	            if(y > 0) {
	                if(radian < 0) {
	                    radian += Math.PI;
	                }
	            } else {
	                if(radian >= 0) {
	                    radian += -Math.PI;
	                }
	            }
	        }
	    }
	    return radian;
	},
	getRadian(vector) {
		let radian = Vector.getSignedRadian(vector);
		if(radian < 0) {
			radian += 2 * Math.PI;
		}
		return radian;
	},
	setRadianSinCos(vector, sinr, cosr) {
		let length = Vector.getLength(vector);
		Vector.setXY(vector, length * cosr, length * sinr);
	},
	setRadian(vector, radian) {
		let sinr = Math.sin(radian);
		let cosr = Math.cos(radian);
		Vector.setRadianSinCos(vector, sinr, cosr);
	},
	getScalar(first, second) {
		return Vector.getX(first) * Vector.getX(second)
			+ Vector.getY(first) * Vector.getY(second);
	},
	getRadianBetween(first, second) {
		return Math.abs(Vector.getSignedRadianBetween(first, second));
	},
	getSignedRadianBetween(first, second) {
		let radian = Vector.getSignedRadian(first) - Vector.getSignedRadian(second);
		if(radian > Math.PI) {
			radian -= 2 * Math.PI;
		}
		return radian;
	},
	normalize(vector) {
		Vector.setLength(vector, 1);
	},
	getRotate(vector, radian) {
		let sinr = Math.sin(radian),
			cosr = Math.cos(radian);
		let x = Vector.getX(vector),
			y = Vector.getY(vector);
		return Vector.getVectorXY(x * cosr - y * sinr, x * sinr + y * cosr);
	},
	rotate(vector, radian) {
		let coord = Vector.getRotate(vector, radian);
		Vector.assignToFirst(vector, coord);
	}
};

module.exports = Vector;
},{}]},{},[2,1]);
