pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    environment {
        IMAGE_NAME = "gaurav0915/inventory-frontend"
        IMAGE_TAG  = "latest"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Gauravkute/inventory-frontend.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Run Tests with Coverage') {
            steps {
                bat 'npm test -- --coverage'
            }
        }

        stage('Build Project') {
            steps {
                bat 'npm run build'
            }
        }

        stage('Code Quality Check (SonarQube)') {
            steps {
                withSonarQubeEnv('SonarQubeServer') {
                    withCredentials([string(
                        credentialsId: 'inventory-frontend-token',
                        variable: 'SONAR_TOKEN'
                    )]) {
                        script {
                            def scannerHome = tool 'SonarScanner'
                            bat """
"${scannerHome}\\bin\\sonar-scanner.bat" ^
-Dsonar.projectKey=inventory-frontend ^
-Dsonar.projectName=Inventory-Frontend ^
-Dsonar.sources=src ^
-Dsonar.tests=src ^
-Dsonar.javascript.lcov.reportPaths=coverage/lcov.info ^
-Dsonar.token=%SONAR_TOKEN%
"""
                        }
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t inventory-frontend .'
                bat 'docker tag inventory-frontend %IMAGE_NAME%:%IMAGE_TAG%'
            }
        }

        stage('Push Image to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    bat """
echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin
docker push %IMAGE_NAME%:%IMAGE_TAG%
"""
                }
            }
        }

        stage('Deploy Application') {
            steps {
                bat 'docker rm -f inventory-frontend || exit 0'
                bat 'docker run -d --name inventory-frontend -p 3000:80 %IMAGE_NAME%:%IMAGE_TAG%'
            }
        }
    }

    post {
        success {
            echo 'CI/CD Pipeline executed successfully'
        }
        failure {
            echo 'CI/CD Pipeline failed'
        }
    }
}
