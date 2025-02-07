

from pathlib import Path
import os
from dotenv import load_dotenv

# Load the environment variables from the .env file
load_dotenv()





# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-hyy!_$u5*+m&ivg-i8(0bc(4ug6!x4dt)jkk0f@(_9qpc@ncyr'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'api',
    'corsheaders',
    'rest_framework',
    'rest_framework.authtoken', 
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(BASE_DIR, 'templates')
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'

# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

STATIC_URL = '/static/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# CORS settings
CORS_ALLOW_CREDENTIALS = True 
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    # Your React app origin
]


CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173",  # Add this to avoid CSRF errors with the React frontend
]





SESSION_COOKIE_SAMESITE = 'None'  
SESSION_COOKIE_SECURE = True

SESSION_COOKIE_SECURE = False  # Set to True in production with HTTPS




REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.TokenAuthentication',
    ),
}



# Now you can retrieve the Stripe keys from the environment
STRIPE_PUBLISHABLE_KEY = "pk_test_51PrlUJIT8L3mTUWyvEKWAot1feoZ96f3xUaalzXnE35Ayf6vVnInwQyEMbDi19dTF5GyL5eaV4EC9fMMg549rEwL00751USh3u"
STRIPE_SECRET_KEY = "sk_test_51PrlUJIT8L3mTUWynDwei5uuONW41TagqPj5EJj5ARGo3O2dh78SQJ0XX5rtW2mtcwbPalPq1qN8rt5PCccYfca2006oVeUZGu"
STRIPE_WEBHOOK_SECRET = 'whsec_8ea857985fc53c9b3174cf1bdd4e8d18e18e19db9178b004bef6076518856b3b'  







EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = "mappexgeo@gmail.com"  # Replace with your email
EMAIL_HOST_PASSWORD = "ttjb dksi rwzl zftv"  # Replace with your app-specific password