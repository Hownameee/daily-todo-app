pipeline {
    agent any

    stages {
        stage('Security Scan') {
            environment {
                SNYK_TOKEN = credentials('snyk-token-id')
            }
            steps {
                script {
                    echo '--- 1. Gitleaks: Checking for Secrets ---'
                    sh """
                        docker run --rm \
                            -v "${WORKSPACE}":/code \
                            ghcr.io/gitleaks/gitleaks:latest \
                            detect --source /code --verbose --redact
                    """

                    echo '--- 2. Snyk: Checking Dependencies & Code ---'
                    sh """
                        docker run --rm \
                            --entrypoint /bin/bash \
                            -e SNYK_TOKEN=${SNYK_TOKEN} \
                            -v "${WORKSPACE}":/project \
                            -w /project \
                            snyk/snyk:node \
                            -c "snyk test --severity-threshold=high --all-projects"
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
                        sh 'npm install --ignore-scripts'
                        sh 'npx buf generate'
                    }
                }

                stage('Lint & Build') {
                    steps {
                        sh 'npx turbo run lint'
                        sh 'npx turbo run build'
                    }
                }
            }
        }

        stage('Container Scan & Deploy') {
            environment {
                SNYK_TOKEN  = credentials('snyk-token-id')
                MONGODB_URI = credentials('MONGODB_URI')
                APP_IMAGE   = "daily-todo-app:${env.BUILD_ID}"
            }
            steps {
                script {
                    echo '--- 3. Build & Scan Container ---'
                    sh "docker build -t ${APP_IMAGE} ."
                    
                    sh """
                        docker run --rm \
                            -e SNYK_TOKEN=${SNYK_TOKEN} \
                            -v /var/run/docker.sock:/var/run/docker.sock \
                            -v "${WORKSPACE}":/project \
                            -w /project \
                            snyk/snyk:docker \
                            snyk container test ${APP_IMAGE} --file=Dockerfile
                    """

                    echo '--- 4. Final Deploy ---'
                    sh "docker rm -f daily-todo-container || true"
                    sh "docker run -dp 3000:4000 --name daily-todo-container -e MONGOURI=$MONGODB_URI ${APP_IMAGE}"
                }
            }
        }
    }
}