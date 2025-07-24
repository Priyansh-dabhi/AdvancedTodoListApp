// components/Time.tsx
import React, { useEffect, useState } from 'react';
import { Platform, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

type Props = {
  visible: boolean;
  initialTime?: Date;
  onClose: () => void;
  onTimeSelected: (time: Date) => void;
};

const Time = ({
  visible,
  onClose,
  onTimeSelected,
  initialTime = new Date(),
}: Props) => {
  const [selectedTime, setSelectedTime] = useState(initialTime);

  useEffect(() => {
    if (visible && Platform.OS === 'android') {
      // Directly open Android time picker
      setShowPicker(true);
    }
  }, [visible]);

  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (_: any, time?: Date) => {
    setShowPicker(false);
    onClose();
    if (time) {
      setSelectedTime(time);
      onTimeSelected(time);
    }
  };

  if (!visible || !showPicker) return null;

  return (
    <View>
      <DateTimePicker
        value={selectedTime}
        mode="time"
        display="default" // You can use 'spinner' or 'clock' if needed
        is24Hour={false}   // shows AM/PM format
        onChange={handleChange}
      />
    </View>
  );
};

export default Time;
