import React from 'react';
import PropTypes from 'prop-types';
import { values, pickBy, has, omit, map, startCase, pick, remove } from '../../../utils/lodash';
import moment from 'moment';
import { Pie } from 'react-chartjs-2';
import { PieColors } from '../GraphColors';
import config from '../../../config';

const PieGraph = ({ data_values, labels, time_period}) => {
  const datasets = [
    {
      label: startCase(time_period),
      fill: false,
      backgroundColor:  PieColors,
      data: data_values
    }
  ];

  const chartData = {
    labels: labels,
    datasets: datasets
  };

  const chartOptions = {
    title: {
      display: false
    },
    legend: {
      display: true,
      position: 'right',
      onClick: function(e){ e.stopPropagation(); },
      labels: {
        generateLabels: function(chart) {
          var data = chart.data;
          if (data.labels.length && data.datasets.length) {
            return data.labels.map(function(label, i) {
              var meta = chart.getDatasetMeta(0);
              var ds = data.datasets[0];
              var arc = meta.data[i];
              var custom = arc && arc.custom || {};
              var getValueAtIndexOrDefault = Chart.helpers.getValueAtIndexOrDefault;
              var arcOpts = chart.options.elements.arc;
              var fill = custom.backgroundColor ? custom.backgroundColor : getValueAtIndexOrDefault(ds.backgroundColor, i, arcOpts.backgroundColor);
              var stroke = custom.borderColor ? custom.borderColor : getValueAtIndexOrDefault(ds.borderColor, i, arcOpts.borderColor);
              var bw = custom.borderWidth ? custom.borderWidth : getValueAtIndexOrDefault(ds.borderWidth, i, arcOpts.borderWidth);
              var value = chart.config.data.datasets[arc._datasetIndex].data[arc._index];
              return {
                text: label + ': ' + value + '%',
                fillStyle: fill,
                strokeStyle: stroke,
                lineWidth: bw,
                hidden: isNaN(ds.data[i]) || meta.data[i].hidden,

                    // Extra data used for toggling the correct item
                index: i
              };
            });
          }
          return [];
        }
      }
    },

    tooltips: {
      callbacks: {
        label: function(tooltipItem, data){
          var index = tooltipItem.index;                 
          return  data.labels[index] + ': ' + data.datasets[0].data[index] + '%';
        }
      }
    },
    maintainAspectRatio: true
  };

  return  (
    <div className="explorer__pie-graph">
      <Pie data={chartData} options={chartOptions} />
    </div>
  );
};

export default PieGraph;

