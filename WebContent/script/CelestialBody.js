/**
   Copyright (c) 2015 Alberto Mercati
 
    This file is part of Gravity.

    Gravity is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Gravity is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Gravity. If not, see <http://www.gnu.org/licenses/>.
 */

function CelestialBody(mass, velocity, mesh){
	this.mass = mass;
	this.velocity = velocity;
	this.acceleration = new THREE.Vector3(0, 0, 0);
	this.mesh = mesh;
	this.markedForRemoval = false;
	
	this.getPosition = function(){
		return mesh.position;
	};
	
        this.getRadius = function(){
            if(mesh.geometry.boundingSphere === null)
                mesh.geometry.computeBoundingSphere();
            return mesh.geometry.boundingSphere.radius;
        };
        
	this.getVelocity = function(){
		return this.velocity;
	};
        
	this.squareDistanceFrom = function(body){
		myPosition = this.getPosition();
		//customLog("myPosition = " + myPosition);
		var squareDistance = body.getPosition().distanceToSquared(myPosition);
		//customLog("squareDistance = " + squareDistance);
		return squareDistance;
	};
	
	this.distanceFrom = function(body){
		return this.getPosition().distanceTo(body.getPosition());
	};
	
	this.forceBetween = function(body){
		var squareDistance = this.squareDistanceFrom(body);
		//customLog("mass1 = " + this.mass + "; mass2 = " + body.mass + "; product = " + this.mass * body.mass);
		var force = Constants.G * (this.mass * body.mass) / squareDistance;
		//customLog("force = " + force);
		return force;
	};
	
	this.addForceContribution = function(body){
		var forceMagnitude = this.forceBetween(body);
		//customLog("forceMagnitude = " + forceMagnitude);
		var distance = this.distanceFrom(body);
//		customLog("distance = " + distance);
		var xDiff = body.getPosition().x - this.getPosition().x;
		var yDiff = body.getPosition().y - this.getPosition().y;
		var zDiff = body.getPosition().z - this.getPosition().z;
		
		var xRatio = xDiff / distance;
		var yRatio = yDiff / distance;
		var zRatio = zDiff / distance;
		
		var fx = forceMagnitude * xRatio;
		var fy = forceMagnitude * yRatio;
		var fz = forceMagnitude * zRatio;
		
		var forceVector = new THREE.Vector3(fx, fy, fz);
		
		this.acceleration.add(forceVector.divideScalar(this.mass));
	};
	
	this.updatePosition = function(delta){
		if(!delta){
			delta = Constants.DEFAULT_TIME_DELTA; // just to make debugging possible
		}

		/* *
		this.velocity.add(this.acceleration.multiplyScalar(delta));
		var tempVelocity = this.velocity.clone();
		var nextPosition = this.getPosition().clone();
		nextPosition.add( tempVelocity.multiplyScalar(delta) );
		/* */

		/* */
		this.velocity.add(this.acceleration.multiplyScalar(delta));
		var nextPosition = this.getPosition().clone();
		var tempAcceleration = this.acceleration.clone();
		var tempVelocity = this.velocity.clone();
		// nextPosition.add( tempAcceleration.multiplyScalar(delta * delta).multiplyScalar(.5) );
		nextPosition.add( tempVelocity.multiplyScalar(delta) );
		/* */


		this.mesh.position.x = nextPosition.x;
		this.mesh.position.y = nextPosition.y;
		this.mesh.position.z = nextPosition.z;
		
		// customLog("position = " + JSON.stringify( this.mesh.position ));
		this.acceleration = new THREE.Vector3(0, 0, 0);
		// customLog("velocity after acceleration update = " + JSON.stringify(this.velocity));
	};
        
        this.overlaps = function(otherBody){
          return this.distanceFrom(otherBody) <= this.getRadius() + otherBody.getRadius();
        };
}