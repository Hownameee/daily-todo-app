pipeline {
    agent any

    stages {
        stage('Security Scan') {
            environment {
                SONAR_TOKEN = credentials('sonarqube-token-id')
                SONAR_HOST_URL = credentials('sonarqube-host-url')
            }
            steps {
                script {
                    echo '--- 1. SonarQube: Scanning Code Quality ---'
                    sh """
                        docker run --rm \
                            -e SONAR_HOST_URL=${SONAR_HOST_URL} \
                            -e SONAR_TOKEN=${SONAR_TOKEN} \
                            -v "${WORKSPACE}":/usr/src \
                            sonarsource/sonar-scanner-cli \
                            -Dsonar.projectKey=daily-todo-app \
                            -Dsonar.sources=. \
                            -Dsonar.exclusions=**/node_modules/**,**/dist/**,**/.turbo/**
                    """
                }
            }
        }

        stage('Node Build') {
            agent {
                docker {
                    image 'node:22-alpine'
                    reuseNode true
                    args '-u root'
                }
            }
            stages {
                stage('Install & Generate') {
                    steps {
                        echo '--- 2. NPM: Installing Dependencies ---'
                        sh 'npm install --ignore-scripts'

                        echo '--- 3. Buf: Generating Protobuf ---'
                        sh 'npx buf generate'
                    }
                }

                stage('Lint & Build') {
                    steps {
                        echo '--- 4. Turbo: Running Linter ---'
                        sh 'npx turbo run lint'

                        echo '--- 5. Turbo: Building Project ---'
                        sh 'npx turbo run build'
                    }
                }
            }
        }

        stage('Container Scan & Deploy') {
            environment {
                MONGODB_URI = credentials('MONGODB_URI')
                APP_IMAGE   = 'daily-todo-app:latest'
            }
            steps {
                script {
                    echo '--- 6. Docker: Building Container Image ---'
                    sh "docker build -t ${APP_IMAGE} ."

                    echo '--- 7. Docker: Cleaning up old container ---'
                    sh 'docker rm -f daily-todo-container || true'

                    echo '--- 8. Docker: Deploying Application ---'
                    sh "docker run -dp 3000:4000 --name daily-todo-container -e MONGOURI=${MONGODB_URI} ${APP_IMAGE}"
                }
            }
        }
    }

    post {
        always {
            echo '--- 9. Docker: Clean Up ---'
            sh 'docker image prune -af'
        }
    }
}