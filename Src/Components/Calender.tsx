// components/Calendar.tsx
import React from 'react';
import { View, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

type CalendarProps = {
  selectedDate: Date;
  onChange: (_: any, date?: Date) => void;
};

const Calendar = ({ selectedDate, onChange }: CalendarProps) => {
  return (
    <View>
      <DateTimePicker
        value={selectedDate}
        mode="date"
        display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
        onChange={onChange}
      />
    </View>
  );
};

export default Calendar;
