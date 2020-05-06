load('api_config.js');
load('api_gpio.js');
load('api_mqtt.js');
load('api_timer.js');

let SENSOR = 5;
let STATUS_LED = 13;

GPIO.setup_input(SENSOR, GPIO.PULL_NONE);
GPIO.setup_output(STATUS_LED, true);

GPIO.set_int_handler(SENSOR, GPIO.INT_EDGE_ANY, function(pin) {
  let motion = GPIO.read(SENSOR);
  print("MOTION: ", motion);
  GPIO.write(STATUS_LED, !motion);
  let topic = 'garage/' + Cfg.get('device.id') + '/status';
  let message = JSON.stringify({
    motion: motion
  });
  let ok = MQTT.pub(topic, message, 1);
  print('Published:', ok ? 'yes' : 'no', 'topic:', topic, 'message:', message);
}, null);

GPIO.write(STATUS_LED, GPIO.read(SENSOR));
GPIO.enable_int(SENSOR);
