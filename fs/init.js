load('api_config.js');
load('api_gpio.js');
load('api_mqtt.js');
load('api_timer.js');

let SENSOR = 5;
let STATUS_LED = 13;

GPIO.setup_input(SENSOR, GPIO.PULL_UP);
GPIO.setup_output(STATUS_LED, false); // led is active low, this turns it on

function set_led(on) {
  let lvl = !!!on;
  GPIO.write(STATUS_LED, lvl);
}

function update() {
  let motion = GPIO.read(SENSOR);
  set_led(motion);
  print("MOTION: ", motion);

  // MQTT
  let topic = 'garage/' + Cfg.get('device.id') + '/status';
  let message = JSON.stringify({
    motion: motion
  });
  let ok = MQTT.pub(topic, message, 1);

  print('Published:', ok ? 'yes' : 'no', 'topic:', topic, 'message:', message);
}

GPIO.set_int_handler(SENSOR, GPIO.INT_EDGE_ANY, function(pin) {
  update();
}, null);

MQTT.setEventHandler(function(conn, ev, edata) {
  if (ev !== 0) print('MQTT event handler: got', ev);
  if (ev === MQTT.EV_CONNACK) {
    update();
  }
}, null);

GPIO.enable_int(SENSOR);
