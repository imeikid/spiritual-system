import React from 'react';
import { useIntegratedSystemStore } from '../../stores/integrated-system-store';

export const AnalyticsDashboard: React.FC = () => {
  const { analytics } = useIntegratedSystemStore();
  
  const MetricBar: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
    <div className="metric-bar">
      <div className="metric-label">{label}</div>
      <div className="metric-track">
        <div 
          className="metric-fill" 
          style={{ 
            width: `${value * 100}%`,
            backgroundColor: color
          }}
        />
        <div className="metric-value">{Math.round(value * 100)}%</div>
      </div>
    </div>
  );
  
  return (
    <div className="analytics-dash">
      <div className="metrics-section">
        <h4>Метрики развития</h4>
        <MetricBar label="Постоянство практики" value={analytics.userMetrics.practiceConsistency} color="#4ecdc4" />
        <MetricBar label="Скорость роста" value={analytics.userMetrics.growthVelocity} color="#45b7d1" />
        <MetricBar label="Стабильность паттернов" value={analytics.userMetrics.patternStability} color="#ff6b6b" />
        <MetricBar label="Частота достижений" value={analytics.userMetrics.milestoneFrequency} color="#96ceb4" />
      </div>
      
      <div className="insights-section">
        <h4>Последние инсайты</h4>
        {analytics.insights.slice(0, 2).map(insight => (
          <div key={insight.id} className="insight">
            <strong>{insight.title}</strong>
            <p>{insight.description}</p>
          </div>
        ))}
      </div>
      
      <style>{`
        .analytics-dash {
          height: 100%;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .metrics-section h4,
        .insights-section h4 {
          margin: 0 0 10px 0;
          color: #4ecdc4;
          font-size: 0.9em;
        }
        
        .metric-bar {
          margin-bottom: 10px;
        }
        
        .metric-label {
          font-size: 0.8em;
          margin-bottom: 4px;
          color: #ccc;
        }
        
        .metric-track {
          height: 8px;
          background: #333;
          border-radius: 4px;
          position: relative;
        }
        
        .metric-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.3s ease;
        }
        
        .metric-value {
          position: absolute;
          right: -30px;
          top: -2px;
          font-size: 0.7em;
          color: #ccc;
        }
        
        .insight {
          background: rgba(255, 107, 107, 0.1);
          border-left: 2px solid #ff6b6b;
          padding: 8px;
          margin-bottom: 8px;
          border-radius: 0 4px 4px 0;
        }
        
        .insight strong {
          font-size: 0.8em;
          color: #ff6b6b;
        }
        
        .insight p {
          font-size: 0.7em;
          margin: 4px 0 0 0;
          color: #ccc;
        }
      `}</style>
    </div>
  );
};
