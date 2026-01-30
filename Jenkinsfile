pipeline {
    agent any

    tools {
        git 'Git-2.44'
        nodejs 'NodeJS'
    }

    environment {
        IMAGE_NAME = "gaurav0915/inventory-frontend"
        IMAGE_TAG  = "latest"
    }

    stages {
        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Gauravkute/inventory-frontend.git'
            }
        }

        stage('Reset Node Modules') {
            steps {
                // Using || exit 0 to prevent failure if node_modules doesn't exist yet
                bat 'if exist node_modules rmdir /s /q node_modules'
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
                    def scannerHome = tool 'SonarScanner'
                    withSonarQubeEnv('SonarQubeServer') {
                        withCredentials([
                            string(credentialsId: 'inventory-frontend-token', variable: 'SONAR_TOKEN')
                        ]) {
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
                bat 'docker build -t %IMAGE_NAME%:%IMAGE_TAG% .'
            }
        }

        stage('Trivy Image Scan') {
            steps {
                bat """
                IF NOT EXIST trivy-templates mkdir trivy-templates

                curl -L https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/html.tpl ^
                -o trivy-templates\\report.html

                curl -L https://raw.githubusercontent.com/Gauravkute/custom-templates/main/html-with-chart.tpl ^
                -o trivy-templates\\html-with-chart.tpl

                trivy image --severity LOW,MEDIUM,HIGH,CRITICAL ^
                --format template ^
                --template "@trivy-templates\\html-with-chart.tpl" ^
                --output trivy-report.html %IMAGE_NAME%:%IMAGE_TAG%
                """
            }
        }

        stage('Generate Security Dashboard') {
            steps {
                script {
                    def dashboardContent = """
                    <html>
                    <head><title>Security Dashboard</title></head>
                    <body>
                    <h2>Pipeline Metrics</h2>
                    <ul>
                      <li>Build Number: ${env.BUILD_NUMBER}</li>
                      <li>Docker Image: ${env.IMAGE_NAME}:${env.IMAGE_TAG}</li>
                      <li>Security Scan: Completed</li>
                    </ul>
                    </body>
                    </html>
                    """
                    writeFile file: 'dashboard.html', text: dashboardContent
                }
            }
        }

        stage('Push Image to Docker Hub') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-creds', 
                        usernameVariable: 'DOCKER_USER', 
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {
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
            archiveArtifacts artifacts: 'trivy-report.html', allowEmptyArchive: false
            
            publishHTML([
                reportName: 'Trivy Security Report',
                reportDir: '.',
                reportFiles: 'trivy-report.html',
                keepAll: true,
                alwaysLinkToLastBuild: true
            ])

            publishHTML([
                reportName: 'Security Dashboard',
                reportDir: '.',
                reportFiles: 'dashboard.html',
                keepAll: true,
                alwaysLinkToLastBuild: true
            ])
            
            // Clean up Docker credentials on the agent
            bat 'docker logout'
        }
        success {
            echo 'CI/CD Pipeline executed successfully!'
        }
        failure {
            echo 'CI/CD Pipeline failed. Check the logs for details.'
        }
    }
}
