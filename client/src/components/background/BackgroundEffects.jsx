import FlowLine from './FlowLine';
import { FLOW_PATHS } from './flowPaths';

const BackgroundEffects = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none line3d-wrap">

      <div className="wave wave-1" />
      <div className="wave wave-2" />
      <div className="wave wave-3" />

      <FlowLine
        path={FLOW_PATHS.far}
        color="rgba(227,159,10,0.85)"
        width={19}
        className="line3d line3d--far"
        top="18%"
      />

      <FlowLine
        path={FLOW_PATHS.mid}
        color="rgba(255,210,122,0.9)"
        width={15}
        className="line3d line3d--mid"
        top="34%"
      />

      <FlowLine
        path={FLOW_PATHS.nearBlue}
        color="rgba(120,200,255,0.9)"
        width={11}
        className="line3d line3d--near"
        top="50%"
      />

      <FlowLine
        path={FLOW_PATHS.nearPink}
        color="rgba(255,120,180,0.9)"
        width={13}
        className="line3d line3d--near"
        top="45%"
      />

    </div>
  );
};

export default BackgroundEffects;
