import BackgroundEffects from '../background/BackgroundEffects';
import AuthCard from './AuthCard';
import AuthSocial from './AuthSocial';
import AuthFields from './AuthFields';

const AuthFormView = (props) => {
  return (
    <div className="relative w-[min(420px,92vw)] overflow-hidden rounded-2xl">

      <div className="absolute inset-0 z-0 pointer-events-none">
        <BackgroundEffects />
      </div>

      <div className="relative z-10">
        <AuthCard>
          <AuthSocial
            onGoogleSuccess={props.onGoogleSuccess}
            onGoogleError={props.onGoogleError}
          />

          <AuthFields
            isLogin={props.isLogin}
            formData={props.formData}
            onChange={props.onChange}
            onSubmit={props.onSubmit}
            onToggleMode={props.onToggleMode}
            error={props.error}
          />
        </AuthCard>
      </div>
    </div>
  );
};

export default AuthFormView;
