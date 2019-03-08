import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import ReactTable from 'react-table';

import ServiceNameBadge from './ServiceNameBadge';
import { getServiceNameColor } from '../util/color';
import { detailedSpanPropTypes } from '../prop-types';

const propTypes = {
  serviceNameColumnWidth: PropTypes.number.isRequired,
  span: detailedSpanPropTypes.isRequired,
};

const renderInfo = span => (
  <div className="timeline-span-data__content">
    <div
      className="timeline-span-data__title"
      style={{
        borderColor: getServiceNameColor(span.serviceName),
      }}
    >
      {`${span.serviceName}: ${span.spanName}`}
    </div>
    <div className="timeline-span-data__aka-badges">
      {
        span.serviceNames
          ? span.serviceNames.map(serviceName => (
            <ServiceNameBadge
              key={serviceName}
              serviceName={serviceName}
              className="timeline-span-data__aka-badge"
            />
          ))
          : null
      }
    </div>
    <ReactTable
      showPagination={false}
      minRows={0 /* Hide empty rows */}
      data={
        span.annotations.map(a => (
          {
            duration: moment(a.timestamp / 1000).format('MM/DD HH:mm:ss:SSS'),
            relativeTime: a.relativeTime,
            annotation: a.value,
            address: a.endpoint,
          }
        ))
      }
      columns={
        [
          { Header: 'Date Time', accessor: 'duration' },
          { Header: 'Relative Time', accessor: 'relativeTime' },
          { Header: 'Annotation', accessor: 'annotation' },
          { Header: 'Address', accessor: 'address' },
        ]
      }
    />
    <ReactTable
      showPagination={false}
      minRows={0 /* Hide empty rows */}
      data={span.tags}
      columns={
        [
          { Header: 'Key', accessor: 'key' },
          { Header: 'Value', accessor: 'value' },
        ]
      }
    />
  </div>
);

const SpanInfo = ({ span, serviceNameColumnWidth }) => (
  <div className="timeline-span-data">
    <div
      className="timeline-span-data__left-container"
      style={{ width: `${serviceNameColumnWidth * 100}%` }}
    >
      <span
        className="timeline-span-data__depth-marker"
        style={{
          left: `${span.depth * 14}px`,
          background: `${getServiceNameColor(span.serviceName)}`,
        }}
      />
    </div>
    <div
      className="timeline-span-data__right-container"
      style={{
        left: `${(serviceNameColumnWidth) * 100}%`,
        width: `${(1 - serviceNameColumnWidth) * 100}%`,
      }}
    >
      {renderInfo(span)}
    </div>
  </div>

);

SpanInfo.propTypes = propTypes;

export default SpanInfo;
