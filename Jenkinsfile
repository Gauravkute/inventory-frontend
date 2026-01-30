pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    environment {
        IMAGE_NAME   = "gaurav0915/inventory-frontend"
        IMAGE_TAG    = "latest"
        TRIVY_REPORT = "trivy-report.html"
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

        stage('Unit Tests with Coverage') {
            steps {
                bat 'npm test -- --coverage --watchAll=false --passWithNoTests'
            }
        }

        stage('Build React App') {
            steps {
                bat 'npm run build'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    withSonarQubeEnv('SonarQubeServer') {
                        def scannerHome = tool name: 'SonarScanner', type: 'hudson.plugins.sonar.SonarRunnerInstallation'
                        withCredentials([string(credentialsId: 'inventory-frontend-token', variable: 'SONAR_TOKEN')]) {
                            bat """
"${scannerHome}\\bin\\sonar-scanner.bat" ^
-Dsonar.projectKey=inventory-frontend ^
-Dsonar.projectName=Inventory-Frontend ^
-Dsonar.sources=src ^
-Dsonar.tests=src ^
-Dsonar.test.inclusions=**/*.test.js ^
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

        stage('Trivy Image Scan') {
            steps {
                script {
                    try {
                        bat 'trivy --version'
                        bat """
trivy image ^
--severity HIGH,CRITICAL ^
--format html ^
--output %TRIVY_REPORT% ^
%IMAGE_NAME%:%IMAGE_TAG%
"""
                        // bat 'docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:0.68.2 image inventory-frontend:latest'
                    } catch (err) {
                        echo "Trivy not installed or not found. Skipping image scan."
                    }
                }
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
        always {
            archiveArtifacts artifacts: 'trivy-report.html', allowEmptyArchive: true, fingerprint: true
        }
        success {
            echo 'CI/CD Pipeline executed successfully'
        }
        failure {
            echo 'CI/CD Pipeline failed'
        }
    }
}
