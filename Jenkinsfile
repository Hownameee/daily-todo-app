pipeline {
    agent any

    stages {
        stage('Security Scan') {
            environment {
                SNYK_TOKEN = credentials('snyk-token-id')
                SONAR_TOKEN = credentials('sonarqube-token-id')
                SONAR_HOST_URL = credentials('sonarqube-host-url')
            }
            steps {
                script {
                    echo '--- 1. Gitleaks: Checking for Secrets ---'
                    sh """
                        docker run --rm \
                            -v "${WORKSPACE}":/code \
                            ghcr.io/gitleaks/gitleaks:latest \
                            detect --source /code --verbose --redact --no-color
                    """

                    echo '--- 2. Snyk: Checking Dependencies ---'
                    sh """
                        docker run --rm \
                            --entrypoint /bin/bash \
                            -e SNYK_TOKEN=${SNYK_TOKEN} \
                            -v "${WORKSPACE}":/project \
                            -w /project \
                            snyk/snyk:node \
                            -c "snyk test --severity-threshold=high --all-projects"
                    """
                    
                    echo '--- 3. SonarQube: Scanning Code Quality ---'
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
                    image 'node:22'
                    reuseNode true
                    args '-u root'
                }
            }
            stages {
                stage('Install & Generate') {
                    steps {
                        echo '--- 4. NPM: Installing Dependencies ---'
                        sh 'npm install --ignore-scripts'

                        echo '--- 5. Buf: Generating Protobuf ---'
                        sh 'npx buf generate'
                    }
                }

                stage('Lint & Build') {
                    steps {
                        echo '--- 6. Turbo: Running Linter ---'
                        sh 'npx turbo run lint'

                        echo '--- 7. Turbo: Building Project ---'
                        sh 'npx turbo run build'
                    }
                }
            }
        }

        stage('Container Scan & Deploy') {
            environment {
                SNYK_TOKEN  = credentials('snyk-token-id')
                MONGODB_URI = credentials('MONGODB_URI')
                APP_IMAGE   = "daily-todo-app:latest"
            }
            steps {
                script {
                    echo '--- 8. Docker: Building Container Image ---'
                    sh "docker build -t ${APP_IMAGE} ."
                    
                    echo '--- 9. Snyk: Scanning Container Image ---'
                    sh """
                        docker run --rm \
                            -e SNYK_TOKEN=${SNYK_TOKEN} \
                            -v /var/run/docker.sock:/var/run/docker.sock \
                            -v "${WORKSPACE}":/project \
                            -w /project \
                            snyk/snyk:docker \
                            snyk container test ${APP_IMAGE} --file=Dockerfile
                    """

                    echo '--- 10. Docker: Cleaning up old container ---'
                    sh "docker rm -f daily-todo-container || true"

                    echo '--- 11. Docker: Deploying Application ---'
                    sh "docker run -dp 3000:4000 --name daily-todo-container -e MONGOURI=${MONGODB_URI} ${APP_IMAGE}"
                }
            }
        }
    }
}