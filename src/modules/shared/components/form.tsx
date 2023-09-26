/* eslint-disable react/no-unused-prop-types */
import axios from 'axios';
import clsx from 'clsx';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  type ChangeEvent,
  type FunctionComponent,
  useState,
  useEffect,
} from 'react';

import type { AppSvgProps } from '@/utils/types';
import type { CustomerAddress } from '@/models/address';
import { PUBLIC_MAPS_KEY } from '@/utils/env';
import { isIsoDate } from '@/utils/helper';

export interface AppInputProps {
  type?: string;
  unit?: string;
  title: string;
  field: string;
  value?: string;
  loading?: boolean;
  placeholder: string;
  Icon: FunctionComponent<AppSvgProps>;
  onSelect?: (e: number | string) => void;
  values?: { id?: string; value: string }[];
  options?: { id: string | number; value: string }[];
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function AppInput({
  Icon,
  unit,
  type,
  title,
  field,
  values,
  options,
  loading,
  onSelect,
  onChange,
  value: val,
  placeholder,
}: AppInputProps) {
  const [value, setValue] = useState(val);
  const [hide, setHide] = useState(true);

  useEffect(() => {
    setHide(!value);
  }, [value]);

  useEffect(() => {
    if (val !== value) setValue(val);
  }, [val]);
  return (
    <div className="relative flex w-full flex-col gap-2">
      <span className="text-sm font-medium text-accent-1/90">{title}</span>
      <div className="relative z-40 flex  flex-row gap-3 rounded-md border-[1px] border-accent-3 bg-white px-4 pb-2 pt-3 focus-within:border-2 focus-within:border-accent-2">
        <Icon
          className={clsx('inherit h-5 w-5 fill-accent-2', values && '-mt-1')}
        />
        {values && (
          <select
            name={field}
            aria-label={field}
            placeholder={placeholder}
            defaultValue="--select--"
            className="m-0 -mt-1 w-full  whitespace-pre-wrap border-transparent p-0 text-sm capitalize placeholder:text-sm focus:outline-none focus:ring-0 focus-visible:right-0 focus-visible:outline-none active:outline-none active:ring-0"
            onChange={(e) => {
              // @ts-expect-error
              onChange(e);
              setValue(e.target.value);
            }}
          >
            {[{ id: '-1', value: '--select--' }, ...values].map(
              ({ id, value: _val }) => {
                return (
                  <option key={id} value={id}>
                    {_val}
                  </option>
                );
              }
            )}
          </select>
        )}
        {!values && (
          <input
            name={field}
            type={type}
            value={value}
            placeholder={placeholder}
            className="z-50 m-0 -mt-px flex-1 border-transparent p-0 text-sm placeholder:text-sm focus:outline-none focus:ring-0"
            onChange={(e) => {
              onChange(e);
              setValue(e.target.value);
            }}
          />
        )}
        {unit && (
          <span className="rounded bg-accent-2 px-3 pt-1 text-xs font-light text-white">
            {unit}
          </span>
        )}
      </div>
      {((options && !hide && options.length !== 0) || loading) && (
        <div className="absolute inset-x-2 top-16  z-0 flex flex-col gap-1 rounded-b-lg border border-accent-3 bg-white p-2 pb-3 pt-6">
          {!loading &&
            options &&
            options.length !== 0 &&
            options.map((option) => (
              <button
                key={option.id}
                type="button"
                className={clsx(
                  'w-full border-b border-b-accent-3 p-1.5 text-start text-sm',
                  option.id === options.length - 1 && 'border-none'
                )}
                onClick={() => {
                  if (onSelect) onSelect(option.id);
                  if (onSelect) setHide(true);
                }}
              >
                {option.value}
              </button>
            ))}
          {loading && <span className="loader my-6 h-7 w-7 self-center" />}
        </div>
      )}
    </div>
  );
}

interface DatePickerProps extends Omit<AppInputProps, 'onChange'> {
  onChange: (x: Date) => void;
  classname?: string;
}
export function DatePicker({
  title,
  Icon,
  value,
  onChange,
  classname,
}: DatePickerProps) {
  const initial = isIsoDate(value as string)
    ? new Date(value as string)
    : new Date();
  const [date, setDate] = useState(initial);
  useEffect(() => {
    if (value !== date.toISOString() && value) setDate(new Date(value));
  }, [value]);
  const handleChange = (selectedDate: Date) => {
    setDate(selectedDate);
    onChange(selectedDate);
  };

  return (
    <div
      className={clsx(
        'relative flex w-full flex-col gap-2',
        !classname && 'z-50',
        classname
      )}
    >
      <span className="text-sm font-medium text-accent-1/90">{title}</span>
      <div className="relative z-40 flex  flex-row gap-3 rounded-md border-[1px] border-accent-3 bg-white px-4 pb-2 pt-3 focus-within:border-2 focus-within:border-accent-2">
        <Icon className={clsx('inherit h-5 w-5 fill-accent-2')} />
        <ReactDatePicker onChange={handleChange} selected={date} />
      </div>
    </div>
  );
}

interface PlacesAutoCompleteProps {
  title: string;
  placeholder: string;
  value?: CustomerAddress;
  Icon: FunctionComponent<AppSvgProps>;
  onChange: (e?: CustomerAddress) => void;
}

export function PlacesAutoComplete({
  Icon,
  title,
  value,
  onChange,
  placeholder,
}: PlacesAutoCompleteProps) {
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState<any[]>();
  const [timeout, updateTimeout] = useState<NodeJS.Timeout>();
  const [keyword, setKeyword] = useState(value?.place_name ?? '');

  async function getPlacePredictions() {
    const { data } = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${keyword}.json?limit=6&access_token=${PUBLIC_MAPS_KEY}`
    );
    setLoading(false);
    setPredictions(data.features);
  }

  const loadPredictions = async (e: string) => {
    setKeyword(e);
    setLoading(true);
    onChange(undefined);
    if (timeout) clearTimeout(timeout);
    updateTimeout(setTimeout(() => getPlacePredictions(), 750));
  };

  const selectPrediction = async (id: string) => {
    if (predictions) {
      const val = predictions[parseInt(id, 10)];
      const address: CustomerAddress = {
        id: val.id,
        place_name: val.place_name,
        place_type: val.place_type,
        geometry: {
          bbox: val.bbox,
          center: val.center,
          coordinates: val.geometry.coordinates,
        },
      };
      setKeyword(address.place_name);
      setPredictions([]);
      onChange(address);
    }
  };

  return (
    <AppInput
      field=""
      Icon={Icon}
      title={title}
      value={keyword}
      loading={loading}
      placeholder={placeholder}
      onSelect={(e) => selectPrediction(`${e}`)}
      onChange={(e) => loadPredictions(e.target.value)}
      options={predictions?.map(({ place_name }, id) => ({
        id,
        value: place_name,
      }))}
    />
  );
}
