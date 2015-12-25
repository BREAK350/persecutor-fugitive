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