/* 
 * Copyright (C) 2015 Alberto Mercati
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

Constants = {
		"G" : 6.673E-11,
		"EARTH_MASS" : 10E13, // 	5.972E+24,
		"MOON_MASS" : 3E10, // 7.348E+22,
		"JUPITER_MASS" : 1.8986E+27,
		"EARTH_MOON_DISTANCE" : 384400000, //384,400 Km
		"EARTH_MOON_SCREEN_DISTANCE" : 50,
		"DISTANCE_SCALE_FACTOR" :  undefined,
		"DEFAULT_TIME_DELTA" : .02,
		"LOG_ENABLED" : true,
		"REMOVE_DISTANT_BODIES" : true,
		"REMOVAL_DISTANCE_THRESHOLD" : 1E4 //1000... is it good? is it bad?
                ,
                "CAMERA_MOVEMENT_STEP" : 1,
                "CONTROLS_TYPE" : "trackball"
}

Constants.DISTANCE_SCALE_FACTOR = Constants.EARTH_MOON_DISTANCE / Constants.EARTH_MOON_SCREEN_DISTANCE;