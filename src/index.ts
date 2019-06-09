import { Transform } from 'stream';
import { ConsumerGroupStream } from 'kafka-node';

const {
    KAFKA_HOST,
    CONSUMER_GROUP_ID,
    KAFKA_TOPIC
} = process.env;

const consumerOptions = {
    kafkaHost: KAFKA_HOST,
    groupId: CONSUMER_GROUP_ID,
    sessionTimeout: 15000,
    asyncPush: false
  };
  
  const consumerGroup = new ConsumerGroupStream(consumerOptions, KAFKA_TOPIC);
  
  const messageTransform = new Transform({
    objectMode: true,
    decodeStrings: true,
    transform (message) {
      console.log(`Received message ${message.value} transforming input`);
    }
  });
  
  consumerGroup.pipe(messageTransform);