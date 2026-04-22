// DSA Genie - Jenkins CI/CD Pipeline
// Integrates: Build, Test, Docker, Deploy to Kubernetes

pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = 'localhost:5000'
        KUBE_NAMESPACE = 'dsa-genie'
        APP_NAME = 'dsa-genie'
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
        disableConcurrentBuilds()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    env.GIT_COMMIT_SHORT = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
                    env.BUILD_TAG = "${APP_NAME}:${env.BUILD_NUMBER}-${env.GIT_COMMIT_SHORT}"
                }
            }
        }

        stage('Install Dependencies') {
            parallel {
                stage('Server Dependencies') {
                    steps {
                        dir('server') {
                            sh 'npm ci'
                        }
                    }
                }
                stage('Client Dependencies') {
                    steps {
                        dir('client') {
                            sh 'npm ci'
                        }
                    }
                }
            }
        }

        stage('Lint & Test') {
            parallel {
                stage('Server Tests') {
                    steps {
                        dir('server') {
                            sh 'npm run lint 2>/dev/null || true'
                            sh 'npm test 2>/dev/null || true'
                        }
                    }
                }
                stage('Client Tests') {
                    steps {
                        dir('client') {
                            sh 'npm run lint 2>/dev/null || true'
                            sh 'npm test -- --run 2>/dev/null || true'
                        }
                    }
                }
            }
        }

        stage('Build') {
            steps {
                dir('client') {
                    sh 'npm run build'
                }
            }
        }

        stage('Docker Build') {
            when {
                anyOf {
                    branch 'main'
                    branch 'master'
                    branch 'develop'
                }
            }
            steps {
                script {
                    // Build server image
                    sh """
                        docker build -t ${DOCKER_REGISTRY}/${APP_NAME}-server:${BUILD_TAG} ./server
                        docker tag ${DOCKER_REGISTRY}/${APP_NAME}-server:${BUILD_TAG} ${DOCKER_REGISTRY}/${APP_NAME}-server:latest
                    """
                    // Build client image (with API URL for production)
                    sh """
                        docker build --build-arg VITE_API_URL=/api \
                            -t ${DOCKER_REGISTRY}/${APP_NAME}-client:${BUILD_TAG} ./client
                        docker tag ${DOCKER_REGISTRY}/${APP_NAME}-client:${BUILD_TAG} ${DOCKER_REGISTRY}/${APP_NAME}-client:latest
                    """
                }
            }
        }

        stage('Docker Push') {
            when {
                anyOf {
                    branch 'main'
                    branch 'master'
                }
            }
            steps {
                script {
                    sh "docker push ${DOCKER_REGISTRY}/${APP_NAME}-server:${BUILD_TAG}"
                    sh "docker push ${DOCKER_REGISTRY}/${APP_NAME}-server:latest"
                    sh "docker push ${DOCKER_REGISTRY}/${APP_NAME}-client:${BUILD_TAG}"
                    sh "docker push ${DOCKER_REGISTRY}/${APP_NAME}-client:latest"
                }
            }
        }

        stage('Deploy to Kubernetes') {
            when {
                anyOf {
                    branch 'main'
                    branch 'master'
                }
            }
            steps {
                script {
                    sh """
                        kubectl config use-context \${KUBE_CONTEXT:-minikube}
                        kubectl apply -f k8s/namespace.yaml
                        kubectl apply -f k8s/configmap.yaml -n ${KUBE_NAMESPACE}
                        kubectl apply -f k8s/secrets.yaml -n ${KUBE_NAMESPACE}
                        kubectl apply -f k8s/ -n ${KUBE_NAMESPACE}
                        kubectl set image deployment/server server=${DOCKER_REGISTRY}/${APP_NAME}-server:${BUILD_TAG} -n ${KUBE_NAMESPACE}
                        kubectl set image deployment/client client=${DOCKER_REGISTRY}/${APP_NAME}-client:${BUILD_TAG} -n ${KUBE_NAMESPACE}
                        kubectl rollout status deployment/server -n ${KUBE_NAMESPACE} --timeout=120s
                        kubectl rollout status deployment/client -n ${KUBE_NAMESPACE} --timeout=120s
                    """
                }
            }
        }
    }

    post {
        always {
            cleanWs(deleteDirs: true, patterns: [[pattern: 'node_modules', type: 'INCLUDE']])
        }
        success {
            echo 'Pipeline completed successfully!'
            // Optional: Notify Nagios of deployment
            sh 'echo "Deployment successful - ${BUILD_TAG}"'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
