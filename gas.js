// Create a physics instance which uses the Verlet integration method
function start_main_loop () {
    var physics = new Physics();
    physics.integrator = new ImprovedEuler();

    // Design some behaviours for particles
    var avoidMouse = new Attraction();
    var pullToCenter = new Attraction();

    var wander = new Wander(12, 120, Random(1.0, 2.0));

    var edges = new EdgeBlink(new Vector(0,0), new Vector(800,800));
    var center_line = new EdgeLine(400,450);
    // Allow particle collisions to make things interesting
    var collision = new Collision();

    // Use Sketch.js to make life much easier
    var example = Sketch.create({ container: document.body });

    example.setup = function() {

        for ( var i = 0; i < 200; i++ ) {  // slow particles
            var particle = new Particle( Math.random() );
            var position = new Vector( random( 420,800 ), random( 0,800 ) );
            particle.setRadius( particle.mass * 10 );
            particle.moveTo( position );
            particle.setVel( new Vector(random(-1,1),random(-1,1)));
            collision.pool.push( particle );
            particle.behaviours.push(edges,collision,center_line)
            physics.particles.push( particle );
        }
         for ( var i = 0; i < 200; i++ ) {  // fast particles
            var particle = new Particle( Math.random() );
            var position = new Vector( random( 400 ), random( 800 ) );
            particle.setRadius( particle.mass * 10 );
            particle.moveTo( position );
            particle.setVel( new Vector(random(-300,300),random(-300,300)));
            collision.pool.push( particle );
            particle.behaviours.push(edges,collision,center_line)
            physics.particles.push( particle );
        }
        // pullToCenter.target.x = this.width / 2;
        // pullToCenter.target.y = this.height / 2;
        // pullToCenter.strength = 120;
        
        // avoidMouse.setRadius( 60 );
        // avoidMouse.strength = -1000;
        
        example.fillStyle = '#ff00ff';
    }

    example.draw = function() {

        // Step the simulation
        physics.step();
		// render barrier
        example.fillStyle = '#ff00ff';
        example.fillRect(390,0,20,400);
        example.fillRect(390,450,20,this.width-450);
        // Render particles
        for ( var i = 0, n = physics.particles.length; i < n; i++ ) {

            var particle = physics.particles[i];
            color = toColor(particle.vel.x*particle.vel.x+particle.vel.y*particle.vel.y);
            example.fillStyle = color;
            example.beginPath();
            example.arc( particle.pos.x, particle.pos.y, particle.radius, 0, Math.PI * 2 );  
            example.fill();
        }
    }

    example.mousemove = function() {
        avoidMouse.target.x = example.mouse.x;
        avoidMouse.target.y = example.mouse.y;
    }
    example.click = function(){
        if (example.running){
            example.stop()
        }
        else{
            example.start()
        }      
    }

    function toColor(num) {  // velocity  as red intensity
        var b = 0,
            g = 0,
            r = parseInt(num*255.0/20000.0),
            a = 1 ;
        return "rgba(" + [r, g, b, a].join(",") + ")";
    }
}